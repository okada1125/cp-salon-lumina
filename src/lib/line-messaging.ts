import { Client } from "@line/bot-sdk";

// LINE Messaging API クライアントの設定
const lineClient = new Client({
  channelAccessToken:
    process.env.LINE_CHANNEL_ACCESS_TOKEN || "your_access_token_here",
  channelSecret:
    process.env.LINE_CHANNEL_SECRET || "9239b0c9a368bbc48b4c6601201a00aa",
});

interface ContactData {
  kanjiName: string;
  katakanaName: string;
  phoneNumber: string;
  referrer?: string;
}

/**
 * 登録完了メッセージを送信
 */
export async function sendRegistrationMessage(
  userId: string,
  contactData: ContactData
): Promise<void> {
  try {
    const message = `ご登録ありがとうございます🌿
以下の内容で登録しました☺️

👤 お名前：${contactData.kanjiName}
📝 カタカナ：${contactData.katakanaName}
📞 電話番号：${contactData.phoneNumber}${
      contactData.referrer ? `\n👥 紹介者：${contactData.referrer}` : ""
    }`;

    await lineClient.pushMessage(userId, {
      type: "text",
      text: message,
    });

    console.log("登録完了メッセージを送信しました:", userId);
  } catch (error) {
    console.error("LINEメッセージ送信エラー:", error);
    throw error;
  }
}

/**
 * エラーメッセージを送信
 */
export async function sendErrorMessage(
  userId: string,
  errorMessage: string
): Promise<void> {
  try {
    const message = `申し訳ございません。登録処理中にエラーが発生しました。\n\nエラー内容：${errorMessage}\n\n再度お試しください。`;

    await lineClient.pushMessage(userId, {
      type: "text",
      text: message,
    });

    console.log("エラーメッセージを送信しました:", userId);
  } catch (error) {
    console.error("LINEエラーメッセージ送信エラー:", error);
    throw error;
  }
}
