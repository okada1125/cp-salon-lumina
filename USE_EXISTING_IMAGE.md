# 既存の Artifact Registry イメージを使用する方法

## 現在の設定

Artifact Registry に以下のイメージが存在します：

- **プロジェクト**: `mystic-benefit-467802-s9`
- **リポジトリ**: `cp-salon-lumina`
- **イメージ**: `cp-salon-lumina-app`
- **タグ**: `latest`
- **場所**: `asia-northeast1`

## 方法 1: Cloud Run で直接既存イメージを使用

### 手順

1. **Google Cloud Console** → **Cloud Run** にアクセス

2. **「サービスを作成」** をクリック

3. **「既存のコンテナイメージから」タブを選択**（現在選択中）

4. **コンテナイメージの URL を入力**：

```
asia-northeast1-docker.pkg.dev/mystic-benefit-467802-s9/cp-salon-lumina/cp-salon-lumina-app:latest
```

または

**「選択」ボタンをクリック**して、Artifact Registry から選択：

- リポジトリ：`cp-salon-lumina`
- イメージ：`cp-salon-lumina-app`
- タグ：`latest`

5. **「次へ」をクリック**

6. **サービス設定**：

**リージョン**: `asia-northeast1`

**サービス名**: `line-contact-form`

**認証**: **未認証の呼び出しを許可** にチェック

**環境変数**を追加：

- `DATABASE_URL` = `mysql://root:KvRPDbd>\m.L}701@35.221.114.163:3306/line_contact_form`
- `LINE_CHANNEL_SECRET` = `9239b0c9a368bbc48b4c6601201a00aa`
- `LIFF_ID` = `2008317301-ANXP8KZG`
- `LINE_CHANNEL_ACCESS_TOKEN` = `9239b0c9a368bbc48b4c6601201a00aa`

7. **「作成」をクリック**

## 方法 2: Cloud Build を使ってデプロイ

`cloudbuild.yaml`を更新しました。これで Artifact Registry にイメージがビルド＆プッシュされます。

### 手順

1. **Google Cloud Console** → **Cloud Build** にアクセス

2. **「RUN」または「手動ビルド」**をクリック

3. 設定：

   - Source: GitHub `okada1125/cp-salon-lumina`
   - Branch: `main`
   - Configuration: `cloudbuild.yaml`

4. **「実行」をクリック**

5. ビルド完了後、自動的に Cloud Run にデプロイされます

## 方法 3: gcloud CLI で直接デプロイ

```bash
gcloud run deploy line-contact-form \
  --image asia-northeast1-docker.pkg.dev/mystic-benefit-467802-s9/cp-salon-lumina/cp-salon-lumina-app:latest \
  --region asia-northeast1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=mysql://root:KvRPDbd>\m.L}701@35.221.114.163:3306/line_contact_form,LINE_CHANNEL_SECRET=9239b0c9a368bbc48b4c6601201a00aa,LIFF_ID=2008317301-ANXP8KZG,LINE_CHANNEL_ACCESS_TOKEN=9239b0c9a368bbc48b4c6601201a00aa"
```

## 推奨方法

**最も簡単な方法 1**を使うことをお勧めします：

1. Cloud Run → サービスを作成
2. 既存のコンテナイメージを選択（「選択」ボタンから選ぶのが簡単）
3. 環境変数を設定
4. デプロイ

これで完了です！
