FROM node:21-alpine AS dependencies
WORKDIR /app

# Ativa o corepack e instala o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./
RUN pnpm install

FROM node:21-alpine AS build
WORKDIR /app

# Ativa o corepack e instala o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=dependencies /app/node_modules ./node_modules
COPY prisma ./prisma/
COPY . .

# Instala o openssl
RUN apk add --no-cache openssl3 

ARG VERSION="docker-nidoran"
RUN pnpm run build

FROM node:21-alpine AS deploy
WORKDIR /app
# Remova este RUN, pois o 'apt-get' não existe no Alpine Linux
# RUN apt-get update -y 
ENV NODE_ENV production

FROM node:21-alpine AS server
WORKDIR /app

# Ativa o corepack e instala o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 7777

CMD ["pnpm", "run", "start:prod"]
