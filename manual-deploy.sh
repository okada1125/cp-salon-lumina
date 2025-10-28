#!/bin/bash

echo "========================================="
echo "Cloud Build 手動デプロイスクリプト"
echo "========================================="

# プロジェクトIDを確認
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "エラー: gcloud CLIがインストールされていないか、プロジェクトが設定されていません。"
    echo ""
    echo "以下の方法で解決できます："
    echo "1. Google Cloud Console (https://console.cloud.google.com) にアクセス"
    echo "2. Cloud Build → トリガー → トリガーを作成"
    echo "3. GitHubリポジトリを接続"
    echo "4. 設定："
    echo "   - 名前: line-salon-lumina-deploy"
    echo "   - イベント: Push to a branch"
    echo "   - ブランチ: ^main$"
    echo "   - 設定ファイルの場所: cloudbuild.yaml"
    echo ""
    echo "または、ローカルでgcloud CLIをインストールして実行："
    echo "curl https://sdk.cloud.google.com | bash"
    echo "gcloud auth login"
    echo "gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "プロジェクトID: $PROJECT_ID"
echo ""
echo "Cloud Buildを開始します..."

gcloud builds submit --config cloudbuild.yaml .

echo ""
echo "デプロイ完了！"
echo "Cloud Runサービスを確認してください："
echo "https://console.cloud.google.com/run?project=$PROJECT_ID"

