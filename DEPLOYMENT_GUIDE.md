# Cloud Run へのデプロイ手順

## 方法1: Cloud Buildで手動ビルド（最も簡単）

### 手順

1. **Google Cloud Consoleを開く**
   - https://console.cloud.google.com にアクセス
   - プロジェクトを選択

2. **Cloud Buildの履歴を確認**
   - 左メニューから「Cloud Build」→「履歴」を選択
   - 最新のビルドを確認

3. **新しいビルドを手動で実行**
   - 「+ トリガーを実行」ボタンをクリック
   - または、以下のコマンドを実行：

```bash
# gcloud CLIを使用する場合
gcloud builds submit --config cloudbuild.yaml .
```

4. **ビルドの進行を確認**
   - ビルドログを確認して、エラーがないかチェック
   - 成功すると自動的に Cloud Run にデプロイされます

5. **Cloud Runでサービ스를確認**
   - 「Cloud Run」→「サービス」を選択
   - `line-contact-form` サービスが表示されているか確認
   - URLが発行されているか確認

## 方法2: Cloud Buildトリガーを作成（自動デプロイ）

### 手順

1. **Google Cloud Consoleを開く**
   - https://console.cloud.google.com にアクセス

2. **Cloud Buildトリガーを作成**
   - 左メニューから「Cloud Build」→「トリガー」を選択
   - 右上の「+ トリガーを作成」をクリック

3. **トリガー設定**
   - **名前**: `line-contact-form-deploy`
   - **イベント**: `Push to a branch` を選択
   - **ブランチ**: `^main$` を入力
   
4. **ソースの設定**
   - **リポジトリ**: GitHubリポジトリを接続
     - 「リポジトリの接続」をクリック
     - GitHubアカウントで認証
     - `okada1125/cp-salon-lumina` を選択
   
5. **構成の設定**
   - **タイプ**: `Cloud Build構成ファイル (yaml または json)` を選択
   - **場所**: `cloudbuild.yaml`

6. **作成をクリック**

7. **自動デプロイの確認**
   - GitHubにコードをプッシュすると自動的にビルドが開始されます
   - Cloud Build → 履歴でビルド進行を確認

## 方法3: 既存のビルドを再実行

1. **Google Cloud Consoleを開く**
   - https://console.cloud.google.com にアクセス

2. **Cloud Buildの履歴を確認**
   - 左メニューから「Cloud Build」→「履歴」を選択
   - `line-contact-form` のビルドを探す

3. **再実行**
   - ビルドの右側にあるメニュー（⋮）をクリック
   - 「再実行」を選択

## トラブルシューティング

### ビルドが失敗する場合

**エラー**: `The command '/bin/sh -c npm run build' returned a non-zero code: 1`

**原因**: Prismaクライアントの生成に失敗している可能性

**解決方法**:
1. ビルドログの詳細を確認
2. エラーメッセージを確認して修正

### Cloud Runにサービスが表示されない場合

**原因**: ビルドが失敗しているか、まだ完了していない

**解決方法**:
1. Cloud Build → 履歴でビルド状態を確認
2. 成功している場合は、Cloud Run → サービスで確認
3. リージョン（asia-northeast1）が正しいか確認

### 環境変数が設定されていない場合

**原因**: cloudbuild.yamlの環境変数設定が正しくない

**解決方法**:
1. `cloudbuild.yaml`の環境変数を確認
2. Cloud Run → サービス → line-contact-form → 編集
3. 環境変数を手動で設定

## 現在の設定

- **サービス名**: `line-contact-form`
- **リージョン**: `asia-northeast1`
- **認証**: 公開アクセス（認証なし）
- **環境変数**:
  - `DATABASE_URL`
  - `LINE_CHANNEL_SECRET`
  - `LIFF_ID`
  - `LINE_CHANNEL_ACCESS_TOKEN`

## デプロイ後の確認

1. Cloud Run → サービス → `line-contact-form` を開く
2. サービスURLをコピー
3. ブラウザでアクセスして動作を確認
4. LINE LIFFアプリからもアクセスして動作を確認

