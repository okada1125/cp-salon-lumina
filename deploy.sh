#!/bin/bash
# Cloud Build設定でビルドとデプロイを実行

echo "Cloud Buildを開始します..."
gcloud builds submit --config cloudbuild.yaml .

echo "デプロイ完了！"
