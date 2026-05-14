# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack license sales platform: **Next.js 16 frontend** in `licences-sale-frontend/` (port 3000) and **NestJS REST API** in `licences-api-backend/` (port 3020). Public storefront with cart and WhatsApp-driven checkout, plus an admin panel. Roles: `CLIENT`, `ADMIN`, `SUPER_ADMIN`.

There are two more CLAUDE/guide files worth reading when working in the frontend: `licences-sale-frontend/CLAUDE.md` and `licences-sale-frontend/docs/guide.md` (French). They define the strict frontend conventions; defer to them when they conflict with this file.

## Common Commands

Use **bun** for both projects — never `npm`/`yarn`.

**Frontend** (`licences-sale-frontend/`):
```bash
bun dev              # next dev, port 3000
bun run build        # next build (output: 'standalone')
bun run lint         # biome check .
bun run format       # biome format . --fix
```

**Backend** (`licences-api-backend/`):
```bash
bun run start:dev    # nest start --watch, port 3020
bun run start:prod   # node dist/main
bun run lint         # biome check . --write
bun run test         # jest (unit, *.spec.ts under src/)
bun run test:e2e     # jest --config ./test/jest-e2e.json
jest path/to/file.spec.ts          # run a single unit test
npx prisma migrate dev --name X    # create + apply migration (DEV)
npx prisma migrate deploy          # apply migrations (PROD)
npx prisma generate                # regenerate client after schema edits
./test-flow.sh                     # full HTTP integration suite (assumes server running)
```

Swagger UI: `http://localhost:3020/api/docs`.

## Architecture

### Request lifecycle (frontend → backend)

1. A `page.tsx` Server Component fetches initial data via a co-located `lib.ts` (e.g. `app/admin/products/lib.ts`).
2. Client Components dispatch mutations through Server Actions in `actions.ts`, validated by `next-safe-action` against schemas in `~/validators/`.
3. Both `lib.ts` and `actions.ts` go through `~/lib/api.ts`, which is the **only** axios instance and the only place that reads the `auth_token` cookie. It auto-attaches `Authorization: Bearer <token>` and converts 401s into a typed `AuthenticationError` — handle that explicitly rather than catching all errors.
4. Backend controllers receive the JWT, `JwtAuthGuard` resolves the user, services run Prisma queries.

### Two coexisting backends in the frontend

`src/app/api/*` still contains mock route handlers (with an in-memory `mock-data.ts`) **and** `~/lib/api.ts` already targets the real NestJS API at `NEXT_PUBLIC_API_URL` (default `http://localhost:3020/api`). New work should go through the real API; treat the mock routes as legacy until removed. Do not re-introduce mock-route calls when wiring new pages.

### Two cookies, two purposes

- `auth_token` — JWT for admin auth. Set by `setSessionToken()` in `src/lib/session.ts` (httpOnly, sameSite=lax, 8-day maxAge). Validated by `getSession()` calling backend `/auth/me`. `requireAdmin()` guards `app/admin/layout.tsx` and redirects non-admins to `/`.
- `sessionId` — express-session cookie set by the **backend** in `src/main.ts` for anonymous **cart** identification (7 days). It is *not* the auth token; the cart module keys on it via the `Cart.sessionId` unique field.

Never store either token in localStorage/sessionStorage.

### NestJS global wiring (`src/app.module.ts`)

Three providers are registered globally and apply to every route — do not re-register them per controller:
- `APP_PIPE: ZodValidationPipe` (from `nestjs-zod`) — DTOs declared with `createZodDto(schema)` are auto-validated. Define schemas as `z.object(...)`, export both the schema and `z.infer` type.
- `APP_FILTER: AllExceptionsFilter` — single source of truth for HTTP error responses.
- `APP_INTERCEPTOR: LoggingInterceptor` — request/response logging.

`I18nModule` is wired with three resolvers in priority order: query `?lang=`, header `x-lang`, then `Accept-Language`. Default is `fr`. Translation files live in `src/i18n/{fr,en}/*.json` and are loaded from `dist/i18n/` at runtime (path uses `__dirname`) — they must be copied into the build for production.

### Prisma conventions

Schema in `licences-api-backend/prisma/schema.prisma`. Models use `@@map("snake_case")`; PKs are uuid strings. **Soft deletes** apply to `Category`, `Product`, and `Order` via a nullable `deletedAt` — every read query that should hide archived rows must filter `where: { deletedAt: null }` manually (Prisma has no global middleware here). `OrderItem.productName` snapshots the name at order time so renaming/deleting products doesn't rewrite history.

After any schema change: `npx prisma generate`. Do not edit generated files in `node_modules/.prisma/`.

## Conventions

### Frontend (Next.js)

Hard rules — see `licences-sale-frontend/CLAUDE.md` and `licences-sale-frontend/docs/guide.md` for the full list:
- All filenames **kebab-case**, including components (`category-form-modal.tsx`, never `CategoryFormModal.tsx`).
- Components are **arrow functions**; Biome rule `useArrowFunction` is set to error.
- **No React Context.** Global UI state goes through nuqs (URL) or Server Actions; nothing else.
- Pages default to Server Components — only add `"use client"` when interactivity requires it.
- Per-route layout: `page.tsx`, `actions.ts`, `lib.ts`, `search/params.tsx` (nuqs), `components/` for that route's UI. Dynamic routes nest the same layout under `[slug]/`.
- Path alias: `~/` → `src/`.

### Backend (NestJS)

- One module per domain (`auth`, `categories`, `products`, `cart`, `orders`, `upload`, `health`). Register new modules in `app.module.ts`'s `imports`.
- DTOs in `<module>/dto/`, built with `nestjs-zod` so they pick up the global `ZodValidationPipe`.
- Add user-facing strings to **both** `src/i18n/fr/*.json` and `src/i18n/en/*.json`; missing keys fall back to `fr`.

### Biome

Tabs, single quotes, organize-imports on save. Note the **version skew**: frontend pins `@biomejs/biome` 2.3.13, backend pins 2.3.6 — keep your edits within each project's config and don't unify them in the same commit without a reason.

## Build & deploy notes

- Frontend `next.config.ts` sets `output: 'standalone'` and whitelists remote images from `images.unsplash.com` and `utfs.io` (UploadThing). Add new image hosts there before using `next/image` against them.
- Backend production: `bun run build` then `bun run start:prod`. Before deploy: `npx prisma migrate deploy`, set a real `JWT_SECRET`, set `NODE_ENV=production`, and point `FRONTEND_URL` at the deployed frontend (CORS uses it directly).

## Testing

- Backend `test-flow.sh` is the canonical end-to-end smoke test — it walks auth, CRUD on categories/products, cart, order creation with WhatsApp URL, authorization, soft delete + restore, and i18n. Run it after any change to controllers or guards. It expects an admin account to exist and the dev server to be running on 3020.
- Jest unit tests live next to source as `*.spec.ts` under `src/`. E2E tests use `test/jest-e2e.json`.
- Frontend has no test suite configured.
