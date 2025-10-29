# 最終的なデプロイ手順

## 問題

Artifact Registry の`cp-salon-lumina`リポジトリが空なので、イメージがありません。

## 解決方法

### 方法 1: ソースから直接デプロイ（最も簡単）

1. **現在のモーダルを閉じる**（「キャンセル」をクリック）

2. **画面上部のタブを変更**

   - 「**既存のコンテナイメージから**」を閉じる
   - 「**ソースから直接デプロイ**」タブをクリック

3. **リポジトリを接続**

   - 「リポジトリを接続」をクリック
   - GitHub で認証（初回のみ）
   - `okada1125/cp-salon-lumina` を選択
   - `main` ブランチを選択

4. **ビルド設定**

   - ビルドタイプ: Dockerfile（デフォルト）
   - 場所: Dockerfile（デフォルト）

5. **環境変数を設定**

   - `DATABASE_URL` = `mysql://root:KvRPDbd>\m.L}701@35.221.114.163:3306/line_contact_form`
   - `LINE_CHANNEL_SECRET` = `9239b0c9a368bbc48b4c6601201a00aa`
   - `LIFF_ID` = `2008317301-ANXP8KZG`
   - `LINE_CHANNEL_ACCESS_TOKEN` = `9239b0c9a368bbc48b4c6601201a00aa`

6. **サービス名**: `line-contact-form`
7. **リージョン**: `asia-northeast1`（重要！）
8. **認証**: 未認証の呼び出しを許可
9. **「作成」をクリック**

これで自動的にビルド＆デプロイされます！

### 方法 2: Cloud Build で先にイメージを作成

先にイメージを作成してからデプロイする方法です。

1. **Google Cloud Console** → **Cloud Build** にアクセス

2. **「RUN」または「手動ビルド」**をクリック

3. 設定：

   - Source: GitHub `okada1125/cp-salon-lumina`
   - Branch: `main`
   - Configuration: `cloudbuild.yaml`

4. **「実行」をクリック**

これでイメージがビルドされ、Artifact Registry にプッシュされます。

5. ビルド完了後、Cloud Run でそのイメージを使用してデプロイできます

## 推奨

**方法 1（ソースから直接デプロイ）** が最も簡単です。自動的にイメージを作成してデプロイしてくれます。

## 重要なポイント

**リージョンは`asia-northeast1`（東京）を選択してください！**

現在選択されているリージョンが `europe-west1 (ベルギー)` になっています。これを`asia-northeast1`に変更する必要があります。
