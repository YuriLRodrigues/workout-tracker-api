FROM node:20-slim AS dependencies
WORKDIR /app

# Ativa o corepack e instala o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./
RUN pnpm install

FROM node:20-slim AS build
WORKDIR /app

# Ativa o corepack e instala o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=dependencies /app/node_modules ./node_modules
COPY prisma ./prisma/
COPY . .


RUN apk add --no-cache openssl3 

RUN npx prisma migrate deploy
RUN npx prisma generate

ARG VERSION="docker-nidoran"
RUN pnpm run build

FROM node:20-slim AS deploy
WORKDIR /app


ENV NODE_ENV=production

FROM node:20-slim AS server
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 7777

CMD ["pnpm", "run", "start:prod"]
