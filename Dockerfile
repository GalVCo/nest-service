# Multi-stage Dockerfile for books-service
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM base AS dev-deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS build
ENV NODE_ENV=production
COPY --from=dev-deps /app/node_modules ./node_modules
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src
COPY package.json ./
RUN npm run build && npx prisma generate

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]

