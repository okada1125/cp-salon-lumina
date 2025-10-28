# クイックデプロイ手順（トリガー不要）

## 現在の状況

- GitHub リポジトリ: `okada1125/cp-salon-lumina`
- サービス名: `line-contact-form`
- 設定ファイル: `cloudbuild.yaml`

## デプロイ方法

### 方法 1: Google Cloud Console から実行（最も簡単）

1. **Google Cloud Console にアクセス**
   https://console.cloud.google.com/cloud-build/builds

2. **「トリガーを実行」をクリック**

   - 右上の「トリガーを実行」ボタンをクリック
   - または、「+ トリガーを作成」の近くに「手動ビルド」のようなボタンがあるはずです

3. **ビルド設定**

   - **構成**: Cloud Build 構成ファイル（yaml または json）を選択
   - **場所**: `cloudbuild.yaml` を入力
   - **コミット SHA**: 最新のコミット
   - **ブランチ**: `main`

4. **「実行」をクリック**

### 方法 2: gcloud CLI で実行（ローカルに gcloud CLI が必要）

```bash
# プロジェクトIDを設定
gcloud config set project YOUR_PROJECT_ID

# ビルドを実行
gcloud builds submit --config cloudbuild.yaml .
```

### 方法 3: 既存のビルドを再実行

1. Cloud Build → 履歴
2. 過去の`line-contact-form`のビルドを探す
3. ビルドを選択
4. 「再実行」をクリック

## 注意点

`line-register-app`が「ソース」タイプで表示されているのは、Cloud Source Repositories と連携しているためです。

同じようにするには：

1. Cloud Source Repositories に GitHub リポジトリを接続
2. それを使用して自動デプロイ

でも、手動ビルドでも問題なく動作します！

## 推奨手順

最も確実な方法：

1. Google Cloud Console を開く
2. Cloud Build → 「手動ビルド」（または「トリガーを実行」）
3. 構成ファイル: `cloudbuild.yaml`
4. リポジトリ: `okada1125/cp-salon-lumina`
5. 実行

これで`line-contact-form`が Cloud Run にデプロイされます！
