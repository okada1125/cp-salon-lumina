import { createId } from "cuid2";
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { sendRegistrationMessage } from "@/lib/line-messaging";

interface ContactRequest {
  kanjiName: string;
  katakanaName: string;
  phoneNumber: string;
  referrer: string;
  lineUserId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();

    console.log("リクエストボディ:", JSON.stringify(body, null, 2));

    // バリデーション
    if (
      !body.kanjiName ||
      !body.katakanaName ||
      !body.phoneNumber ||
      !body.lineUserId
    ) {
      console.error("バリデーションエラー: 必須項目が欠落しています");
      return NextResponse.json(
        { message: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // データベースに保存
    console.log("データベースに保存を開始します...");
    const id = createId(); // Prisma の cuid() と互換の形式
    await executeQuery(
      `INSERT INTO contacts (id, kanjiName, katakanaName, phoneNumber, referrer, lineUserId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        body.kanjiName,
        body.katakanaName,
        body.phoneNumber,
        body.referrer || null,
        body.lineUserId,
      ]
    );

    const contactData = {
      id,
      kanjiName: body.kanjiName,
      katakanaName: body.katakanaName,
      phoneNumber: body.phoneNumber,
      referrer: body.referrer || null,
      lineUserId: body.lineUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("新しいお問い合わせ保存成功:", contactData);

    // LINEメッセージを送信（PCユーザーでない場合のみ）
    if (!body.lineUserId.startsWith("pc-user-")) {
      console.log("LINEメッセージを送信します...");
      try {
        await sendRegistrationMessage(body.lineUserId, {
          kanjiName: body.kanjiName,
          katakanaName: body.katakanaName,
          phoneNumber: body.phoneNumber,
          referrer: body.referrer,
        });
        console.log("LINEメッセージ送信成功");
      } catch (lineError) {
        console.error("LINEメッセージ送信エラー:", lineError);
        // LINEメッセージ送信に失敗しても、登録は成功として扱う
      }
    } else {
      console.log("PCユーザーのため、LINEメッセージは送信しません");
    }

    // 成功レスポンス
    return NextResponse.json(
      {
        message: "お問い合わせを受け付けました",
        data: contactData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("お問い合わせ処理エラー - 詳細:");
    console.error(
      "エラータイプ:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "エラーメッセージ:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "スタックトレース:",
      error instanceof Error ? error.stack : "スタックトレースなし"
    );

    // エラーの詳細情報を含めて返す（開発環境の場合）
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        message: "サーバーエラーが発生しました",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
