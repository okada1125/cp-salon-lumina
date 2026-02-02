# Node.js 20のベースイメージを使用（scraping-tool と同様）
FROM node:20-alpine AS base

# 依存関係のインストールステージ
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN rm -rf node_modules/.prisma node_modules/@prisma 2>/dev/null || true
RUN test ! -d node_modules/@prisma || (echo "ERROR: Prisma found - remove from package.json" && exit 1)

# ビルドステージ
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 本番ステージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 公式 Next.js Docker 構成: public / standalone / static を個別にコピー
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# standalone の node_modules を壊さず、必要なパッケージのみ追加
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/mysql2 ./node_modules/mysql2
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@paralleldrive ./node_modules/@paralleldrive

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
