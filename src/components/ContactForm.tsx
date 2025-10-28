"use client";

import { useState } from "react";

interface ContactFormProps {
  lineUserId: string;
}

interface FormData {
  kanjiName: string;
  katakanaName: string;
  phoneNumber: string;
  referrer: string;
}

export default function ContactForm({ lineUserId }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    kanjiName: "",
    katakanaName: "",
    phoneNumber: "",
    referrer: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          lineUserId,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          kanjiName: "",
          katakanaName: "",
          phoneNumber: "",
          referrer: "",
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus("error");
        setErrorMessage(errorData.message || "送信に失敗しました");
      }
    } catch (error) {
      console.error("送信エラー:", error);
      setSubmitStatus("error");
      setErrorMessage("ネットワークエラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          登録が完了しました。
        </h2>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="kanjiName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          名前（漢字） <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="kanjiName"
          name="kanjiName"
          value={formData.kanjiName}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="山田 太郎"
        />
      </div>

      <div>
        <label
          htmlFor="katakanaName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          ナマエ（カタカナ） <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="katakanaName"
          name="katakanaName"
          value={formData.katakanaName}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="ヤマダ タロウ"
        />
      </div>

      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          電話番号 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="090-1234-5678"
        />
      </div>

      <div>
        <label
          htmlFor="referrer"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          紹介者（任意）
        </label>
        <input
          type="text"
          id="referrer"
          name="referrer"
          value={formData.referrer}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="紹介者の名前"
        />
      </div>

      {submitStatus === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
