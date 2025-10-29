# Cloud Source Repositories連携後のステップ

## 現在の状態
- ✅ GitHubリポジトリ: 接続済み
- ✅ Cloud Source Repositories: ミラー作成完了
- ⏳ 次: Cloud Buildトリガーを作成

## 次のステップ: Cloud Buildトリガーを作成

### ステップ1: Cloud Buildトリガー作成ページを開く

1. **Google Cloud Consoleにアクセス**
   https://console.cloud.google.com/cloud-build/triggers

2. **新しいトリガーを作成**
   - 「+ トリガーを作成」ボタンをクリック

### ステップ2: 基本設定

**名前**: `line-contact-form-deploy`

**説明**: LINE Contact Form auto deploy from GitHub

### ステップ3: イベント設定

**イベント**: `Push to a branch` を選択

**ブランチ**: `^main$` を入力

### ステップ4: ソース設定

**リポジトリ**: ドロップダウンから以下を選択
- `okada1125_cp-salon-lumina` 
- （Cloud Source Repositoriesで追加したリポジトリ）

**型**: デフォルト（Manifest）

### ステップ5: 構成設定

**タイプ**: `Cloud Build構成ファイル（yaml または json）` を選択

**場所**: `cloudbuild.yaml` を入力

### ステップ6: その他の設定

**サービスアカウント**: デフォルト（Cloud Build サービス アカウント）のままでOK

**タイムアウト**: デフォルト（10分）のままでOK

### ステップ7: 作成

「作成」ボタンをクリック

## 作成後の確認

### 1. トリガーの確認

- Cloud Build → トリガー を開く
- `line-contact-form-deploy` が表示されているか確認

### 2. 自動デプロイのテスト

何か小さな変更を加えてpushしてみます：

```bash
# READMEにテストコメントを追加
echo "`date`" >> test-deploy.txt
git add test-deploy.txt
git commit -m "Test auto deployment"
git push origin main
```

### 3. ビルドの確認

1. **Cloud Build → 履歴** を開く
2. 新しいビルドが自動的に開始されているか確認
3. ビルドログを確認して、エラーがないかチェック

### 4. Cloud Runサービスの確認

1. **Cloud Run → サービス** を開く
2. `line-contact-form` サービスが作成されているか確認
3. デプロイタイプが「ソース」になっているか確認
4. URLが表示されているか確認

## 成功の確認

以下の条件が満たされていれば成功です：

✅ Cloud Build → トリガーに `line-contact-form-deploy` が表示される  
✅ Cloud Build → 履歴にビルドが表示される（自動的に開始される）  
✅ Cloud Run → サービスに `line-contact-form` が表示される  
✅ デプロイタイプが「ソース」として表示される（`line-register-app`と同じ）  
✅ サービスURLが表示されている  

## トラブルシューティング

### ビルドが開始されない場合

- Cloud Source Repositoriesでミラーリングが完了しているか確認
- トリガーの設定を確認（ブランチ名 `^main$` が正しいか）
- GitHubにコードがpushされているか確認

### ビルドが失敗する場合

- Cloud Build → 履歴 → ビルドを選択 → ログを確認
- エラーメッセージに基づいて修正
- 主な原因：
  - Dockerfileのビルドエラー
  - Prismaクライアントの生成エラー
  - 環境変数の設定エラー

### サービスが表示されない場合

- ビルドが成功しているか確認
- Cloud Run APIが有効になっているか確認
- `cloudbuild.yaml` の設定を確認

## 完成！

これで `line-register-app` と同じように自動デプロイが設定されました。

- GitHubにpushすると自動的にビルドが開始される
- ビルドが成功すると Cloud Run に自動デプロイされる
- Cloud Runで「ソース」タイプとして表示される
- 手動でビルドをトリガーする必要がない

