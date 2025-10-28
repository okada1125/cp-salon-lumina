import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // バリデーション
    if (
      !body.kanjiName ||
      !body.katakanaName ||
      !body.phoneNumber ||
      !body.lineUserId
    ) {
      return NextResponse.json(
        { message: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // データベースに保存
    const contactData = await prisma.contact.create({
      data: {
        kanjiName: body.kanjiName,
        katakanaName: body.katakanaName,
        phoneNumber: body.phoneNumber,
        referrer: body.referrer || null,
        lineUserId: body.lineUserId,
      },
    });

    console.log("新しいお問い合わせ:", contactData);

    // LINEメッセージを送信（PCユーザーでない場合のみ）
    if (!body.lineUserId.startsWith("pc-user-")) {
      try {
        await sendRegistrationMessage(body.lineUserId, {
          kanjiName: body.kanjiName,
          katakanaName: body.katakanaName,
          phoneNumber: body.phoneNumber,
          referrer: body.referrer,
        });
      } catch (lineError) {
        console.error("LINEメッセージ送信エラー:", lineError);
        // LINEメッセージ送信に失敗しても、登録は成功として扱う
      }
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
    console.error("お問い合わせ処理エラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
