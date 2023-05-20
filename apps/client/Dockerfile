FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /project

COPY . .

RUN npm config set registry https://registry.npmmirror.com/ 
RUN yarn global add pnpm 

WORKDIR  /project/apps/client

RUN pnpm i --frozen-lockfile
RUN pnpm build 

FROM base AS runner
WORKDIR /0x1461a0

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /project/apps/client/.next/standalone .
COPY --from=builder /project/apps/client/public ./apps/client/public
COPY --from=builder /project/apps/client/.next/static ./apps/client/.next/static

WORKDIR /0x1461a0/apps/client

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]