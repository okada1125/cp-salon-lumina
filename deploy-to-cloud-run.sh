#!/bin/bash

# プロジェクトIDを取得
PROJECT_ID=$(gcloud config get-value project)
echo "Project ID: $PROJECT_ID"

# 現在のコミットハッシュを取得
COMMIT_SHA=$(git rev-parse --short HEAD)
echo "Commit SHA: $COMMIT_SHA"

# Cloud Buildを実行
echo "Cloud Buildを開始します..."
gcloud builds submit --config cloudbuild.yaml .

echo "デプロイ完了！"

