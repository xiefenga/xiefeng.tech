FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /project

COPY . .

RUN npm config set registry https://registry.npmmirror.com/ 
RUN yarn global add pnpm 

WORKDIR  /project/apps/server

RUN pnpm i --frozen-lockfile
RUN pnpm build 

FROM base AS runner
WORKDIR /0x1461a0

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /project/node_modules ./node_modules

COPY --from=builder /project/apps/server/node_modules ./apps/server/node_modules

COPY --from=builder /project/apps/server/dist ./apps/server/dist

COPY --from=builder /project/apps/server/package.json ./apps/server/package.json

# 挂载数据卷 /0x1461a0/apps/server/.env
# COPY --from=builder /project/apps/server/.env ./apps/server/.env

WORKDIR /0x1461a0/apps/server

USER nestjs

EXPOSE 1461

ENV PORT 1461
CMD ["node", "dist/main.js"]