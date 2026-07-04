# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 16** license sales platform (Licences Sale) with a public storefront and an admin panel. It talks to a real NestJS backend at `http://localhost:3020/api` (source lives in the sibling `../licences-api-backend/`). The old in-memory mock API has been removed — only two thin legacy route handlers remain (`src/app/api/auth/me/route.ts`, `src/app/api/auth/logout/route.ts`). All new data work goes through `~/lib/api.ts`; do not add new handlers under `src/app/api/*`.

**Key Features:**
- Authentication (login/register) with role-based access (`CLIENT`, `ADMIN`, `SUPER_ADMIN`)
- Public storefront: home, category browsing, product detail, search, cart, guest/authenticated checkout, account area (`compte`)
- Admin panel: categories, products, orders, clients, promotions, notifications, settings
- Server Components for rendering, Server Actions for mutations

## Commands

```bash
bun dev              # Start development server (port 3000)
bun run build        # Build for production (output: 'standalone')
bun start            # Start production server
bun run lint         # biome check .
bun run format       # biome format . --fix
```

Always use **bun** for all operations (install, run, etc.) — never npm or yarn. There is no frontend test suite (no `test` script).

## Architecture

### Stack
- **Framework:** Next.js 16 (App Router) · React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Validation:** Zod · **Server Actions:** next-safe-action · **URL State:** nuqs
- **HTTP Client:** axios · **Dates:** date-fns · **Toasts:** sonner · **Icons:** lucide-react
- **Code Quality:** Biome (formatter + linter), pinned at 2.3.13

### Route map (`src/app/`)

- **Storefront:** `page.tsx` (home), `about`, `cart`, `checkout` (+ `checkout/confirmation`), `categories` (+ `categories/[slug]` and hardcoded per-category pages: `adobe`, `antivirus`, `autodesk`, `office`, `systemes-exploitation`, `windows-server`), `products/[slug]` (**detail only**), `recherche` (product listing/search), `compte` (+ `commandes`, `favoris`, `licences`, `profil`, `securite`), plus static pages (`cgv`, `faq`, `contact`, `mentions-legales`, `politique-confidentialite`).
- **Auth:** `auth/login`, `auth/register`, `auth/forgot-password`, `auth/actions.ts`.
- **Admin (protected by `admin/layout.tsx` → `requireAdmin()`):** `categories`, `clients`, `orders`, `products`, `promotions`, `notifications`, `settings`, and the dashboard `admin/page.tsx`.

There is **no `/products` listing route** — `app/products/page.tsx` was removed. Product listing now lives at `/recherche`; browsing happens through `/categories/[slug]` and the per-category pages. `products/` only holds the dynamic `[slug]` detail route. (Note: `src/components/footer.tsx` still links "Boutique" → `/products`, which is now dead — fix to `/recherche` when touching the footer.)

### Per-route co-location pattern

A route folder bundles: `page.tsx` (Server Component), `actions.ts` (Server Actions), `lib.ts` (the route's backend calls), `search/params.tsx` (nuqs parsers), and `components/` (that route's UI). Dynamic routes nest the same layout under `[slug]/`. This is followed most consistently in the admin sections; many public/static pages are just a `page.tsx`.

### Data flow

1. **Server Components (pages)** fetch initial data server-side via the route's `lib.ts`.
2. **Client Components** dispatch mutations through **Server Actions** in `actions.ts`, validated by next-safe-action against schemas in `~/validators/`.
3. Both `lib.ts` and `actions.ts` call the backend through `~/lib/api.ts`.

### API client (`~/lib/api.ts`)

The **only** axios instance (`import 'server-only'`). Exports:
- `apiClient` — the configured axios instance (base URL from `NEXT_PUBLIC_API_URL`, default `http://localhost:3020/api`).
- `api` — `{ get, post, put, patch, delete }`, all generic-typed and routed through one authenticated-request helper.
- `AuthenticationError` — any axios **401** is caught and rethrown as this typed error (other errors pass through). Handle it explicitly rather than catching all errors.

It is the single place that reads auth cookies: it attaches `Authorization: Bearer <auth_token>` when present and forwards the `sessionId` cookie as a `Cookie:` header so the **guest cart** is identified server-side. There are **no** `loginApi`/`registerApi`/`getMeApi` exports — per-domain backend calls live in each route's `lib.ts` (e.g. `auth/login/lib.ts`).

### Session management (`~/lib/session.ts`, `"use server"`)

- `setSessionToken(token)` — stores the JWT in the httpOnly `auth_token` cookie (sameSite, 8-day expiry).
- `getToken()` — reads the token cookie.
- `getSession()` — validates the token by calling backend `${NEXT_PUBLIC_API_URL}/auth/me`.
- `requireAdmin()` — used by `admin/layout.tsx`; checks role and redirects non-admins.
- `clearSession()` — deletes the auth cookie.

Never use localStorage/sessionStorage for tokens.

### Guest vs. authenticated checkout

`checkout/actions.ts` posts to backend `/orders`. Because `~/lib/api.ts` auto-forwards both `auth_token` and the cart `sessionId`, a logged-in user's order is linked to their account while an anonymous visitor checks out as a guest — no branching needed in the action. `AuthenticationError` is surfaced to the user as "Session expirée, reconnectez-vous". (Note: this action is a plain `"use server"` function, not wrapped in next-safe-action — a deviation from the usual validator-backed pattern.)

## Conventions

### File naming & components
- **All files kebab-case** (`category-form-modal.tsx`, never `CategoryFormModal.tsx`).
- Components are **arrow functions**, not declarations (Biome `useArrowFunction: "error"`).

### Component organization
- Pages are Server Components unless interactivity requires `"use client"`.
- Page-specific components go in `[route]/components/`; for dynamic routes (`products/[slug]`), in `products/[slug]/components/`.
- Server Actions in `[route]/actions.ts`; nuqs parsers in `[route]/search/params.tsx`.
- **Shared storefront components** live directly in `src/components/` (not under a route). The reusable product tile is `src/components/product-card.tsx` — a `"use client"` card that wires `useCart`/`useFavorites`, renders price in FCFA (`fr-FR` format, `F` suffix), and handles discount/stock badges. It is the single card used across `featured-products`, the per-category pages, `recherche`, `compte/favoris`, and the related-products strip on the product detail page; edit it once rather than per page. **Curated images:** it holds a hardcoded `localImages` map from product `slug` → a file under `public/images/<Catégorie>/` (folders keyed by category, e.g. `Adobe/`, `Antivirus/`, `Autodeck/`, `office/`, `Systeme d'exploitation/`, `Window server/`). Folder/file names with spaces or apostrophes are **URL-encoded** in the map (`%20`, `%27`). The resolver `getProductImage(product)` (exported, also used by the product-detail hero) returns the local asset for a known slug, else falls back to `product.images[0] ?? product.image`, else a `Package` placeholder — so a newly added product shows the API image until you add its slug + asset.

### Code style (Biome)
Tabs · single quotes · arrow functions enforced · auto-fix unused imports · organize imports on save.

### State management
- **Default rule: do not use React Context** for global state. Use URL state (nuqs) for search/filter params, and Server Actions with `revalidatePath()` for mutations; Server Components re-fetch on navigation.
- **Existing exceptions:** the cart and favorites are implemented as client Context providers (`src/components/cart-provider.tsx`, `src/components/favorites-provider.tsx`), both mounted in the root `src/app/layout.tsx`. `cart-provider` keeps the server cart as its source of truth (calls `/cart` directly via `fetch` with `credentials: 'include'`, with optimistic updates); `favorites-provider` persists a `string[]` to localStorage under `softkey_favorites`. These predate/contradict the rule — follow them for cart/favorites work, but don't introduce new Context providers for other state.

### Validation
- Zod schemas live in `~/validators/`.
- Server Actions validate input via `.schema()` from next-safe-action.

## Important notes

- **Path aliases:** `~/` → `src/`, `@/` → project root.
- **Env:** `NEXT_PUBLIC_API_URL` (default `http://localhost:3020/api`).
- **Build:** `output: 'standalone'` in `next.config.ts` (Docker-friendly). New `next/image` remote hosts must be whitelisted there.
- **TypeScript:** strict mode, JSX `react-jsx`.

## Development workflow

1. **New admin section:** create `src/app/admin/[section]/` with `page.tsx`, `actions.ts`, `lib.ts`, `components/`, and validators in `~/validators/[section].ts`. Do **not** add API routes under `src/app/api/*` — add the endpoint to the NestJS backend instead.
2. **New API endpoint:** add controller + service + Zod DTO in `../licences-api-backend/src/<module>/`, then call it from a route `lib.ts` via `~/lib/api.ts`.
3. **Server Actions:** `"use server"` → `createSafeActionClient()` → chain `.schema()` and `.action()` → call `revalidatePath()` after mutations → return `{ success, data?, error? }`.
4. **Run locally:** start the backend on 3020, then `bun dev`; sign in at `/auth/login`, admin panel at `/admin`.
