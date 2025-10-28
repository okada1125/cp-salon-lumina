# Salon Lumina LINE 連携登録フォーム

LINE LIFF アプリを使用した登録フォームです。LINE公式アカウントのリッチメニューから開く登録フォームです。

## 機能

- LINE ログイン連携（LIFF）
- ユーザー登録フォーム（名前（漢字）、ナマエ（カタカナ）、電話番号、紹介者（任意））
- データベースへの保存（MySQL + Prisma）
- 登録完了後の LINE 自動メッセージ送信
- Cloud Run への自動デプロイ

## 技術スタック

- Next.js 15
- TypeScript
- Prisma
- MySQL
- Tailwind CSS
- LINE LIFF SDK
- LINE Messaging API
- Google Cloud Run

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定してください：

```env
# Database
DATABASE_URL="mysql://user:password@host:3306/database"

# LINE Messaging API
LINE_CHANNEL_ACCESS_TOKEN="your_channel_access_token_here"
LINE_CHANNEL_SECRET="your_channel_secret"

# LIFF ID
LIFF_ID="your_liff_id"
```

### 3. データベースの初期化

```bash
npx prisma db push
npx prisma generate
```

### 4. 開発サーバーの起動

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

## 環境変数

必要な環境変数：

```env
DATABASE_URL="mysql://user:password@host:3306/database"
LINE_CHANNEL_ACCESS_TOKEN="your_channel_access_token"
LINE_CHANNEL_SECRET="your_channel_secret"
LIFF_ID="your_liff_id"
```

## Cloud Run へのデプロイ

### 自動デプロイ（推奨）

1. Cloud Buildトリガーを設定
2. GitHubにプッシュすると自動的にビルド・デプロイされます

### 手動デプロイ

```bash
gcloud builds submit --config cloudbuild.yaml .
```

### 環境変数の設定

Cloud Runの環境変数は`cloudbuild.yaml`に定義されています。

## ファイル構成

```
src/
├── app/
│   ├── api/contact/route.ts    # 登録API
│   ├── layout.tsx
│   └── page.tsx                # メインページ
├── components/
│   └── ContactForm.tsx         # フォームコンポーネント
├── lib/
│   ├── line-messaging.ts      # LINE Messaging API
│   └── prisma.ts              # Prismaクライアント
└── types/
    └── liff.d.ts              # LIFF型定義

public/
└── liff.html                  # LIFFアプリページ

prisma/
└── schema.prisma              # データベーススキーマ

cloudbuild.yaml                 # Cloud Build設定
Dockerfile                      # コンテナイメージ設定
```

## 使用技術

- Next.js 15
- TypeScript
- Prisma
- MySQL
- Tailwind CSS
- LINE LIFF SDK
- Google Cloud Run
