# books-service

Production-leaning NestJS + Prisma + PostgreSQL microservice.

## Features
- NestJS (v10) with strict TypeScript
- Prisma ORM with PostgreSQL 16
- Config module with Joi validation
- Global validation pipe and exception filter
- Logging interceptor with request id
- Health and readiness endpoints (Terminus + Prisma ping)
- OpenAPI docs at `/docs`
- Dockerfile (multi-stage) and docker-compose for PostgreSQL
- GitHub Actions CI (install, generate, lint, build, test)

## Quickstart

1) Start Postgres locally
```bash
docker-compose up -d
```

2) Install and run
```bash
nvm use
npm ci
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
npm run start:dev
```

OpenAPI: http://localhost:3000/docs

Health: http://localhost:3000/health

Readiness: http://localhost:3000/readiness

## Environment
See `.env.example`. For local dev, `.env.development` is auto-loaded.

Key vars:
- `PORT` (default 3000)
- `DATABASE_URL` (Prisma connection string)
- `CORS_ORIGIN` (allowed origin in dev)

## Scripts
- `npm run start:dev` — watch mode via ts-node-dev
- `npm run build` — compile TypeScript
- `npm test` — Jest unit tests
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate:dev` — create/apply dev migration

## CI
Workflow at `.github/workflows/ci.yml` runs install, generate, lint, build, test on PRs.

## Docker
Build and run the app container:
```bash
docker build -t books-service .
docker run --rm -p 3000:3000 --env-file .env.development books-service
```

## Notes
- Prisma migrations only (commit your migrations).
- Health is unauthenticated; readiness uses DB ping.
- JSON logs include `x-request-id` and latency.

