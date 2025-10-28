"use client";

import { useEffect, useState } from "react";
import ContactForm from "@/components/ContactForm";

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export default function Home() {
  const [lineProfile, setLineProfile] = useState<LineProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiffAvailable, setIsLiffAvailable] = useState(false);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // LIFFが初期化されているかチェック
        if (
          typeof window !== "undefined" &&
          (window as { liff?: unknown }).liff
        ) {
          const liff = (window as { liff: unknown }).liff as {
            init: (config: { liffId: string }) => Promise<void>;
            isLoggedIn: () => boolean;
            getProfile: () => Promise<LineProfile>;
            login: () => void;
          };
          setIsLiffAvailable(true);

          // LIFFを初期化
          await liff.init({ liffId: "2008317301-ANXP8KZG" });

          if (liff.isLoggedIn()) {
            const profile = await liff.getProfile();
            setLineProfile(profile);
          } else {
            // 未ログインの場合はLIFFログイン画面にリダイレクト
            liff.login();
          }
        } else {
          // LIFFが利用できない場合（PCブラウザアクセスなど）
          console.log("LIFFが利用できません。PCブラウザアクセスです。");
          // PCアクセスの場合はダミーのプロファイルを設定
          setLineProfile({
            userId: "pc-user-" + Date.now(),
            displayName: "PCユーザー",
          });
        }
      } catch (error) {
        console.error("LIFF初期化エラー:", error);
        // エラーの場合もPCアクセスとして処理
        setLineProfile({
          userId: "pc-user-" + Date.now(),
          displayName: "PCユーザー",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeLiff();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!lineProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">LINEログインが必要です</p>
          <p className="text-sm text-gray-500 mt-2">
            LINEアプリからアクセスしてください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              連携登録フォーム
            </h1>

            {isLiffAvailable && lineProfile && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  LINEアカウント: {lineProfile.displayName}
                </p>
              </div>
            )}

            <ContactForm lineUserId={lineProfile.userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
