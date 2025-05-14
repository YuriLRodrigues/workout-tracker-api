FROM node:20-slim AS dependencies
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM node:20-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=dependencies /app/node_modules ./node_modules
COPY prisma ./prisma/
COPY . .

RUN apt-get update && apt-get install -y openssl
RUN pnpm prisma generate
RUN pnpm run build

FROM node:20-slim AS server
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma


EXPOSE 7777
CMD ["pnpm", "run", "start:prod"]
