# Cloud Source RepositoriesとGitHub連携設定

## 概要

GitHubリポジトリをCloud Source Repositoriesと連携させ、`line-register-app`と同様に「ソース」タイプとして自動デプロイを設定します。

## 設定手順

### ステップ1: Cloud Source RepositoriesにGitHubリポジトリを追加

1. **Google Cloud Consoleを開く**
   - https://console.cloud.google.com にアクセス
   - プロジェクトを選択

2. **Cloud Source Repositoriesに移動**
   - 左メニューから「ソース リポジトリ」を選択
   - または検索で「Cloud Source Repositories」と検索

3. **リポジトリを追加**
   - 「リポジトリを追加」ボタンをクリック
   - 「GitHubリポジトリを接続」を選択

4. **GitHub認証**
   - 「GitHubで認証」をクリック
   - GitHubアカウントで認証
   - 必要に応じて権限を許可

5. **リポジトリを選択**
   - 組織またはアカウントを選択
   - リポジトリ `okada1125/cp-salon-lumina` を選択
   - 「接続」をクリック

6. **接続方法を選択**
   - **ミラー（推奨）**: GitHubをミラーリング（最もシンプル）
   - **型付きマニフェスト**: Cloud Build設定を含む
   
   **推奨**: 「ミラー」を選択

### ステップ2: Cloud Buildトリガーを作成

1. **Cloud Buildに移動**
   - 左メニューから「Cloud Build」→「トリガー」を選択

2. **新しいトリガーを作成**
   - 「+ トリガーを作成」をクリック

3. **トリガー設定を入力**
   
   **基本設定**
   - **名前**: `line-contact-form-deploy`
   - **説明**: `LINE Contact Form auto deploy from GitHub`

   **イベント設定**
   - **イベント**: `Push to a branch` を選択
   - **ブランチ**: `^main$` を入力（mainブランチへのpushでトリガー）

   **ソース設定**
   - **リポジトリ**: 手動で追加したCloud Source Repositoriesのリポジトリを選択
     - ドロップダウンから `okada1125_cp-salon-lumina` を選択
   
   **構成設定**
   - **タイプ**: `Cloud Build構成ファイル（yaml または json）` を選択
   - **場所**: `cloudbuild.yaml` を入力

   **オプション設定**
   - **サービスアカウント**: デフォルトのまま（Cloud Build サービス アカウント）
   - **タイムアウト**: デフォルト（10分）

4. **作成をクリック**

### ステップ3: 初回デプロイ

GitHubにコードをプッシュすると、自動的にビルドが開始されます。

```bash
# 何か変更をコミット（設定ファイルの追加など）
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### ステップ4: ビルドの確認

1. **Cloud Build → 履歴** を確認
   - 新しいビルドが開始されていることを確認
   - ビルドログを確認してエラーがないかチェック

2. **Cloud Run → サービス** を確認
   - `line-contact-form` サービスが作成されているか確認
   - URLが発行されているか確認

## 注意点

### GitHubミラーリング

- Cloud Source RepositoriesはGitHubの変更を自動的にミラーリングします
- GitHubにpushすると数分でミラーに反映されます
- Cloud Buildトリガーはこのミラーを監視してビルドを開始します

### 初回設定後の動作

1. GitHubにpush
2. Cloud Source Repositoriesが自動的に最新の変更を取得（数分）
3. Cloud Buildトリガーが変更を検知
4. 自動的にビルドが開始
5. ビルド成功後、Cloud Runに自動デプロイ

### トラブルシューティング

**ビルドが開始されない場合**
- Cloud Source Repositoriesでミラーリングが完了しているか確認
- トリガーのブランチ名が正しいか確認（`^main$`）
- トリガーの設定を確認

**サービスが作成されない場合**
- Cloud Buildのログを確認してエラーをチェック
- `cloudbuild.yaml`の設定が正しいか確認
- Cloud Run APIが有効になっているか確認

## メリット

✅ **自動デプロイ**: GitHubにpushするだけで自動的にデプロイ  
✅ **統合表示**: Cloud Runで「ソース」タイプとして表示  
✅ **履歴管理**: Cloud Buildでビルド履歴を確認  
✅ **簡単な設定**: Google Cloud Consoleから完結  

## 手動ビルドとの違い

**手動ビルド**
- 毎回手動でビルドをトリガーする必要がある
- Cloud Runで「コンテナ」タイプとして表示

**自動デプロイ（この方法）**
- GitHubにpushするだけで自動的にビルド
- Cloud Runで「ソース」タイプとして表示
- `line-register-app`と同じ形式

## 現在の状況

- GitHubリポジトリ: `okada1125/cp-salon-lumina` ✅
- Cloud Build設定: `cloudbuild.yaml` ✅
- Docker設定: `Dockerfile` ✅
- 次: Cloud Source Repositoriesの接続（この手順）

この手順を実行すると、`line-register-app`と同じように自動デプロイが設定されます！

