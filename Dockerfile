FROM node:21-alpine AS dependencies
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./
RUN pnpm install

FROM node:21-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=dependencies /app/node_modules ./node_modules
COPY prisma ./prisma/
COPY . .

RUN apk add --no-cache openssl3 

ARG VERSION="docker-nidoran"
RUN pnpm run build

FROM node:21-alpine AS server
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 7777

CMD ["pnpm", "run", "start:prod"]
