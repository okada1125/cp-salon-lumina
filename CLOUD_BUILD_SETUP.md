# Cloud Build 設定手順

## 問題
Cloud Runに`line-salon-lumina-register`サービスが表示されない場合、Cloud Buildのトリガーが設定されていない可能性があります。

## 解決方法 1: Cloud Buildトリガーを手動で作成

### 手順
1. Google Cloud Console (https://console.cloud.google.com) にアクセス
2. プロジェクトを選択
3. 左メニューから「Cloud Build」→「トリガー」を選択
4. 右上の「+ トリガーを作成」をクリック
5. 以下の情報を入力：

   **イベント設定**
   - 名前: `line-salon-lumina-deploy`
   - 説明: LINE Salon Lumina register deployment
   - イベント: `Push to a branch`
   - ブランチ: `^main$`
   
   **ソース設定**
   - リポジトリ: GitHubリポジトリを接続（初回の場合）
     - 「リポジトリの接続」をクリック
     - GitHubアカウントで認証
     - `okada1125/cp-salon-lumina`を選択
   
   **構成設定**
   - タイプ: `Cloud Build構成ファイル（yamlまたはjson）`
   - 場所: `cloudbuild.yaml`

6. 「作成」をクリック

7. トリガーが作成されたら、最新のコミットを再トリガーするか、新しいコミットをプッシュ

### サービスを確認
1. Cloud Run → サービス に移動
2. `line-salon-lumina-register`サービスが表示されているか確認

## 解決方法 2: 手動でビルドを実行（開発/テスト用）

ローカルでgcloud CLIを使用する場合：

```bash
# プロジェクトを設定
gcloud config set project YOUR_PROJECT_ID

# ビルドを実行
gcloud builds submit --config cloudbuild.yaml .
```

## 解決方法 3: 既存サービスへのデプロイ

既存のサービス名（例: line-register-app）にデプロイしたい場合：

`cloudbuild.yaml`のサービス名を変更：
```yaml
- "deploy"
- "line-register-app"  # 既存のサービス名に変更
```

## トラブルシューティング

### ビルドが失敗する場合
1. Cloud Build → 履歴 を確認
2. 失敗したビルドをクリックしてログを確認
3. エラーメッセージに基づいて修正

### サービスが表示されない場合
1. Cloud Run → サービス でフィルタをクリア
2. すべてのリージョンを確認
3. プロジェクトIDが正しいか確認

### 404エラーが表示される場合
1. デプロイが成功しているか確認
2. Cloud Runのログを確認（サービス名をクリック → ログ）
3. 環境変数が正しく設定されているか確認

