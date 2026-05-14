# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 16** license sales management platform (Licences Sale) with an admin panel. It talks to a real NestJS backend at `http://localhost:3020/api` (see `licences-sale/licences-api/`). Legacy mock route handlers still live under `src/app/api/*` but new work must go through `~/lib/api.ts` — do not re-introduce mock-route calls.

**Key Features:**
- Authentication system (login/register) with role-based access (CLIENT, ADMIN, SUPER_ADMIN)
- Admin panel for managing categories, products, orders, clients, promotions, and notifications
- Server-side rendering with Server Components
- Server Actions for mutations
- Mock API routes serving as a backend placeholder

## Commands

### Development
```bash
bun dev              # Start development server (port 3000)
bun run build        # Build for production
bun start            # Start production server
bun run lint         # Run Biome linter
```

### Package Management
Always use **bun** for all operations (install, test, run, etc.) - never npm or yarn.

## Architecture

### Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Validation:** Zod
- **Server Actions:** next-safe-action
- **URL State:** nuqs
- **HTTP Client:** axios
- **Date Handling:** date-fns
- **Notifications:** sonner
- **Code Quality:** Biome (formatter + linter)

### Directory Structure

```
src/
├── app/
│   ├── admin/               # Admin panel routes (protected)
│   │   ├── layout.tsx       # Admin layout with requireAdmin() check
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts   # Server Actions for categories
│   │   │   └── components/  # Page-specific components
│   │   └── [other-sections]/
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── actions.ts       # Server Actions for auth
│   ├── api/                 # Mock API routes (placeholder backend)
│   │   ├── mock-data.ts     # In-memory data store
│   │   ├── auth/
│   │   ├── categories/
│   │   └── [other-routes]/
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── lib/
│   ├── api.ts               # Axios client with auth interceptor
│   └── session.ts           # Server-only session management
└── validators/              # Zod schemas
    ├── auth.ts
    └── categories.ts
```

### Data Flow Pattern

1. **Server Components (pages)** - Fetch initial data server-side
2. **Client Components** - Use Server Actions for mutations
3. **Server Actions** (`actions.ts`) - Call API via `~/lib/api.ts`
4. **API Routes** (`/api/*`) - Currently return mock data, meant to be replaced by external API

### Session Management

All session logic is in `~/lib/session.ts` with `"use server"` directive:

- **`setSessionToken(token)`** - Stores JWT in httpOnly cookie (`auth_token`, 8-day expiry)
- **`getToken()`** - Retrieves token from cookie
- **`getSession()`** - Validates token by calling the backend `${NEXT_PUBLIC_API_URL}/auth/me`, redirects to login if invalid
- **`requireAdmin()`** - Used in admin layout, checks role and redirects if unauthorized
- **`clearSession()`** - Deletes auth cookie

Never use localStorage/sessionStorage for tokens.

### Authentication Flow

1. User submits login/register form (Client Component)
2. Form calls `loginAction` or `registerAction` (Server Action in `auth/actions.ts`)
3. Server Action calls `loginApi()` or `registerApi()` from `~/lib/api.ts`
4. API returns `accessToken` and user data
5. Server Action calls `setSessionToken()` to store in cookie
6. Admin layout's `requireAdmin()` validates session on each page load

### API Client (`~/lib/api.ts`)

Exports `api` object with methods: `get`, `post`, `put`, `patch`, `delete`. All methods:
- Automatically attach `Authorization: Bearer <token>` if token exists
- Use the base URL from `NEXT_PUBLIC_API_URL` (default: `http://localhost:3020/api`)
- Return typed responses

Also exports specific auth functions: `loginApi`, `registerApi`, `getMeApi`.

### Mock Data System

`src/app/api/mock-data.ts` contains in-memory mock data for:
- Categories
- Products
- Orders
- Clients
- Dashboard stats

API routes in `/api/*` import this file and manipulate the arrays directly. This is temporary - production will use a real backend.

## Conventions

### File Naming
- **All files in kebab-case** (e.g., `category-form-modal.tsx`, not `CategoryFormModal.tsx`)
- Components use arrow functions, not function declarations

### Component Organization
- Pages must be Server Components unless interactivity requires client-side rendering
- Page-specific components go in `[route]/components/`
- For dynamic routes like `products/[slug]`, components go in `products/[slug]/components/`
- Server Actions for a route go in `[route]/actions.ts`
- Search params logic (nuqs) in `[route]/search/params.tsx`

### Code Style (Biome)
- Tabs for indentation
- Single quotes for strings
- Arrow functions enforced (`useArrowFunction: "error"`)
- Auto-fix unused imports
- Organize imports on save

### State Management
- **Never use React Context** for global state
- Use URL state (nuqs) for search/filter parameters
- Use Server Actions with revalidation for data mutations
- Server Components re-fetch on navigation

### Validation
- All schemas in `~/validators/` using Zod
- Server Actions validate input via `.schema()` from next-safe-action
- API routes perform basic validation (check required fields)

## Important Notes

### Path Aliases
- `~/` maps to `src/`
- `@/` maps to project root

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3020/api`)

### Build Output
- Configured as `standalone` for Docker/containerized deployments (`output: 'standalone'` in `next.config.ts`)

### TypeScript
- Strict mode enabled
- Target: ES2017
- JSX: react-jsx (new transform)

## Development Workflow

1. **Adding a new admin section:**
   - Create folder in `src/app/admin/[section]/`
   - Add `page.tsx` (Server Component)
   - Add `actions.ts` for mutations
   - Add `components/` for UI elements
   - Create validators in `~/validators/[section].ts`
   - Add corresponding API routes in `src/app/api/[section]/`

2. **Adding API endpoints:**
   - Add the endpoint to the NestJS backend in `licences-sale/licences-api/src/<module>/` — controller + service + Zod DTO.
   - From the frontend, call it via `~/lib/api.ts` (the only axios instance). Do **not** add new handlers under `src/app/api/*`; those are legacy mocks slated for removal.

3. **Server Actions pattern:**
   - Always use `"use server"` directive
   - Create safe action client: `const action = createSafeActionClient()`
   - Chain `.schema()` and `.action()`
   - Call `revalidatePath()` after mutations
   - Return `{ success: boolean, data?, error? }` structure

4. **Testing the app:**
   - Start dev server: `bun dev`
   - Navigate to `/auth/login` to sign in
   - Admin panel at `/admin`
   - Mock credentials depend on implementation (currently uses mock API)
