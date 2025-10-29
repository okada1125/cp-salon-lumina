# 最も簡単なデプロイ方法（自動設定）

## 概要

`line-register-app`と同じように、Google Cloud Console から直接ソースコードをデプロイします。
Cloud Source Repositories や Cloud Build トリガーの手動設定は不要です。

## 手順

### ステップ 1: Cloud Run でサービスを作成

1. **Google Cloud Console を開く**
   https://console.cloud.google.com/run

2. **「サービスを作成」をクリック**

3. **デプロイ方法の選択**
   - 「リポジトリを接続」タブをクリック
   - または「ソースから直接デプロイ」を選択

### ステップ 2: GitHub リポジトリの接続

1. **「接続」をクリック**

   - GitHub アカウントで認証（初回のみ）
   - 必要に応じて権限を許可

2. **リポジトリを選択**

   - `okada1125/cp-salon-lumina` を選択

3. **「次へ」をクリック**

### ステップ 3: デプロイ設定

**リージョン**

- リージョン: `asia-northeast1` を選択

**認証**

- ✅ 未認証の呼び出しを許可（公開アクセス）

**環境変数**
以下の環境変数を追加：

```
DATABASE_URL=mysql://root:KvRPDbd>\m.L}701@35.221.114.163:3306/line_contact_form
LINE_CHANNEL_SECRET=9239b0c9a368bbc48b4c6601201a00aa
LIFF_ID=2008317301-ANXP8KZG
LINE_CHANNEL_ACCESS_TOKEN=9239b0c9a368bbc48b4c6601201a00aa
```

**他の設定**

- サービス名: `line-contact-form`
- 他の設定はデフォルトのままで OK

### ステップ 4: デプロイ実行

1. **「作成」をクリック**
2. 自動的に以下が行われる：
   - Cloud Source Repositories への接続
   - Cloud Build トリガーの作成
   - ビルドの開始
   - Cloud Run へのデプロイ

### ステップ 5: 完了を待つ

1. ビルドの進行を確認

   - Cloud Build → 履歴でビルドを確認
   - 通常 5-10 分程度で完了

2. サービスの確認
   - Cloud Run → サービスで `line-contact-form` を確認
   - URL が表示されているか確認

## 完成！

これで `line-register-app` と同じ設定が完了しました！

- ✅ デプロイタイプが「ソース」で表示される
- ✅ GitHub に push すると自動的に再デプロイされる
- ✅ Cloud Source Repositories は自動的に接続される
- ✅ Cloud Build トリガーは自動的に作成される

## 今後の運用

### コードを更新する場合

```bash
# 変更を加える
git add .
git commit -m "Update something"
git push origin main

# 自動的にビルドとデプロイが開始される
```

### デプロイ履歴の確認

- Cloud Run → サービス → `line-contact-form` → 「リビジョン」タブ
- 各リビジョンの URL やトラフィック設定を確認できる

### ログの確認

- Cloud Run → サービス → `line-contact-form` → 「ログ」タブ
- アプリケーションのログを確認できる

## トラブルシューティング

### ビルドが失敗する場合

- Cloud Build → 履歴でエラーを確認
- Dockerfile や cloudbuild.yaml の設定を確認

### 環境変数が設定されていない場合

- Cloud Run → サービス → `line-contact-form` → 「編集」
- 環境変数を手動で追加

### URL にアクセスできない場合

- 「未認証の呼び出しを許可」が設定されているか確認
- サービスの URL を確認
- エラーログを確認
