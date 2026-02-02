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
        // LIFF SDKの読み込みを待つ
        let liffCheckCount = 0;
        while (!(window as { liff?: unknown }).liff && liffCheckCount < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          liffCheckCount++;
        }

        // LIFFが利用可能かチェック
        if ((window as { liff?: unknown }).liff) {
          const liff = (window as { liff: unknown }).liff as {
            init: (config: { liffId: string }) => Promise<void>;
            isLoggedIn: () => boolean;
            getProfile: () => Promise<LineProfile>;
            login: () => void;
          };
          setIsLiffAvailable(true);

          console.log("LIFF SDKが見つかりました。初期化を開始します...");

          // localhost の場合は LINE ログインをスキップ（LIFF は Cloud Run URL にリダイレクトするため）
          const isLocalhost =
            typeof window !== "undefined" &&
            /^https?:\/\/localhost(:\d+)?(\/|$)/.test(
              window.location.origin
            );
          if (isLocalhost) {
            console.log("localhost のため、モックプロファイルで表示");
            setLineProfile({
              userId: "local-dev-" + Date.now(),
              displayName: "ローカル確認用",
            });
          } else {
            // LIFFを初期化
            await liff.init({ liffId: "2008317301-ANXP8KZG" });

            console.log("LIFF初期化成功");

            if (liff.isLoggedIn()) {
              console.log("LINEログイン済みです");
              const profile = await liff.getProfile();
              console.log("プロファイル取得成功:", profile);
              setLineProfile(profile);
            } else {
              console.log("LINE未ログインのため、ログイン画面にリダイレクト");
              liff.login();
              return; // ログイン中は処理を終了
            }
          }
        } else {
          // LIFFが利用できない場合（PCブラウザアクセスなど）
          console.log("LIFF SDKが見つかりません。PCブラウザアクセスです。");
          setLineProfile({
            userId: "pc-user-" + Date.now(),
            displayName: "PCユーザー",
          });
        }
      } catch (error) {
        console.error("LIFF初期化エラー:", error);
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
