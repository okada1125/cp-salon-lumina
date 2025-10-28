# LINE 連携お問い合わせフォーム

LINE LIFF アプリを使用したお問い合わせフォームです。

## 機能

- LINE ログイン連携（LIFF）
- お問い合わせフォーム（名前（漢字）、ナマエ（カタカナ）、電話番号、紹介者（任意））
- データベースへの保存（SQLite + Prisma）
- 登録完了後の LINE 自動メッセージ送信

## セットアップ

### 1. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定してください：

```env
# Database
DATABASE_URL="file:./dev.db"

# LINE Messaging API
LINE_CHANNEL_ACCESS_TOKEN="your_channel_access_token_here"
LINE_CHANNEL_SECRET="9239b0c9a368bbc48b4c6601201a00aa"

# LIFF ID
LIFF_ID="2008317301-ANXP8KZG"
```

### 2. データベースの初期化

```bash
npx prisma migrate dev --name init
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## LINE Developers Console での設定

### LIFF アプリの設定

1. LINE Developers Console で LIFF アプリを作成
2. LIFF ID を取得
3. `.env.local` と `public/liff.html` の LIFF ID を更新

### Messaging API の設定

1. LINE Developers Console でチャネル設定を開く
2. 「Messaging API」タブで以下を取得：
   - **Channel Access Token（長期）**: Messaging API 設定ページの「チャネルアクセストークン」で「発行」
   - **Channel Secret**: チャネル基本設定で確認可能
3. `.env.local` に設定
4. **Webhook URL** を設定（本番環境の URL）
5. **Webhook の利用** を有効化

## 使用技術

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma
- SQLite
- LINE LIFF SDK

## ファイル構成

```
src/
├── app/
│   ├── api/contact/route.ts    # お問い合わせAPI
│   ├── layout.tsx
│   └── page.tsx                # メインページ
├── components/
│   └── ContactForm.tsx         # フォームコンポーネント
├── lib/
│   └── prisma.ts              # Prismaクライアント
└── types/
    └── liff.d.ts              # LIFF型定義

public/
└── liff.html                  # LIFFアプリページ

prisma/
└── schema.prisma              # データベーススキーマ
```
