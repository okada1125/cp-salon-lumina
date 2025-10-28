# Node.js 20のベースイメージを使用
FROM node:20-alpine AS base

# 依存関係のインストールステージ
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# パッケージファイルをコピーして依存関係をインストール（全依存関係）
COPY package*.json ./
RUN npm ci

# ビルドステージ
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 環境変数を設定（ビルド用）
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL:-file:./dev.db}

# Prismaクライアントを生成
RUN npx prisma generate

# Next.jsをビルド
RUN npm run build

# 本番ステージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# システムユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ビルド成果物をコピー
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
