# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack **license sales management platform** consisting of:
- **Frontend**: Next.js 16 application (`licences-sale/`)
- **Backend**: NestJS REST API (`licences-sale/licences-api/`)

The platform enables:
- Public license browsing and shopping cart
- Order placement with WhatsApp integration
- Admin panel for managing categories, products, orders
- Role-based authentication (CLIENT, ADMIN, SUPER_ADMIN)

## Repository Structure

```
projet_licence/
├── licences-sale/              # Next.js frontend (port 3000)
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── admin/          # Admin panel (protected routes)
│   │   │   ├── auth/           # Login/register pages
│   │   │   └── api/            # Mock API routes (temporary)
│   │   ├── lib/                # Utilities (api client, session)
│   │   └── validators/         # Zod schemas
│   ├── docs/guide.md           # Frontend conventions
│   ├── CLAUDE.md               # Frontend-specific guidance
│   └── licences-api/           # NestJS backend (port 3020)
│       ├── src/
│       │   ├── auth/           # JWT authentication
│       │   ├── categories/     # Category management
│       │   ├── products/       # Product management
│       │   ├── cart/           # Shopping cart (session-based)
│       │   ├── orders/         # Order management
│       │   ├── upload/         # UploadThing integration
│       │   ├── common/         # Filters, interceptors, pipes
│       │   ├── config/         # Configuration modules
│       │   └── i18n/           # Localization (fr, en)
│       ├── prisma/
│       │   └── schema.prisma   # Database schema (PostgreSQL)
│       └── test-flow.sh        # Full API integration test script
```

## Common Commands

### Frontend (licences-sale/)
```bash
bun dev              # Start Next.js dev server (port 3000)
bun run build        # Build for production
bun start            # Start production server
bun run lint         # Run Biome linter
bun run format       # Auto-fix Biome issues
```

### Backend (licences-sale/licences-api/)
```bash
bun run start:dev    # Start NestJS dev server with watch mode (port 3020)
bun run start:prod   # Start production server
bun run build        # Compile TypeScript to dist/
bun run lint         # Run Biome linter and auto-fix
bun run test         # Run Jest tests
bun run test:e2e     # Run end-to-end tests
npx prisma migrate dev           # Apply pending migrations
npx prisma generate              # Generate Prisma client
npx prisma studio                # Open Prisma Studio GUI
./test-flow.sh                   # Run complete API integration test
```

**Important**: Always use **bun** as the package manager for both frontend and backend.

## Architecture & Data Flow

### Frontend Architecture (Next.js)

1. **Pages** (`page.tsx`) are Server Components that fetch initial data
2. **Client Components** trigger **Server Actions** for mutations
3. **Server Actions** (`actions.ts`) call the backend API via `~/lib/api.ts`
4. **API Client** (`~/lib/api.ts`) attaches JWT tokens automatically
5. **Session** (`~/lib/session.ts`) manages authentication cookies (server-only)

#### Session Management
- Token stored in httpOnly cookie (`auth_token`, 8-day expiry)
- `getSession()` validates token by calling backend `/auth/me`
- `requireAdmin()` protects admin routes in `admin/layout.tsx`
- Never use localStorage/sessionStorage for tokens

#### Component Organization Pattern
```
app/
└── admin/
    └── products/
        ├── page.tsx              # Server Component (initial fetch)
        ├── actions.ts            # Server Actions (mutations)
        ├── lib.ts                # API calls for this route
        ├── search/
        │   └── params.tsx        # nuqs search params
        └── components/           # Page-specific components
            ├── product-table.tsx
            └── product-form.tsx
```

### Backend Architecture (NestJS)

Built with **modular NestJS structure**:
- **Controllers**: Handle HTTP requests, route parameters, query params
- **Services**: Business logic, Prisma database operations
- **DTOs**: Input validation using Zod schemas via `nestjs-zod`
- **Guards**: JWT authentication (`JwtAuthGuard`)
- **Interceptors**: Logging (`LoggingInterceptor`)
- **Filters**: Global exception handling (`AllExceptionsFilter`)

#### Database (Prisma + PostgreSQL)
- Models: Admin, Category, Product, Cart, CartItem, Order, OrderItem
- Soft deletes: Categories and Products use `deletedAt` field
- Session-based carts: Identified by `sessionId` cookie

#### Key Features
- **JWT Authentication**: Access token (15m) + optional refresh token
- **i18n Support**: French (default) and English
  - Header: `x-lang: en` or `Accept-Language`
  - Query param: `?lang=en`
- **Swagger Documentation**: Available at `http://localhost:3020/api/docs`
- **UploadThing**: Image upload integration
- **WhatsApp Integration**: Generates WhatsApp URLs for orders

## Development Workflow

### Starting the Full Stack

1. **Start Backend**:
   ```bash
   cd licences-sale/licences-api
   bun install
   npx prisma generate
   bun run start:dev   # Runs on port 3020
   ```

2. **Start Frontend**:
   ```bash
   cd licences-sale
   bun install
   bun dev             # Runs on port 3000
   ```

3. **Access Swagger**: http://localhost:3020/api/docs

### Database Workflow

```bash
# Create a new migration
cd licences-sale/licences-api
npx prisma migrate dev --name add_feature

# Apply migrations in production
npx prisma migrate deploy

# Reset database (DEV ONLY - deletes all data)
npx prisma migrate reset

# Open Prisma Studio to view data
npx prisma studio
```

### Adding a New Admin Section

1. **Backend** (licences-api/src/):
   ```bash
   # Create module structure
   mkdir -p promotions/dto
   # Add: promotions.controller.ts, promotions.service.ts, promotions.module.ts
   # Add DTOs in dto/create-promotion.dto.ts, dto/update-promotion.dto.ts
   # Register module in app.module.ts
   ```

2. **Update Prisma Schema**:
   ```prisma
   model Promotion {
     id        String   @id @default(uuid())
     name      String
     discount  Int
     createdAt DateTime @default(now())
   }
   ```
   Then run: `npx prisma migrate dev --name add_promotions`

3. **Frontend** (licences-sale/src/app/admin/):
   ```bash
   mkdir -p admin/promotions/components
   # Add: promotions/page.tsx, actions.ts, lib.ts
   # Add validators in ~/validators/promotions.ts
   ```

### Testing the API

The backend includes a comprehensive test script (`test-flow.sh`) that validates:
- Health checks
- Admin authentication
- Category/Product CRUD operations
- Shopping cart functionality
- Order creation with WhatsApp URL generation
- Authorization enforcement
- Soft delete and restore
- i18n localization (fr/en)

Run with: `cd licences-sale/licences-api && ./test-flow.sh`

## Code Conventions

### Frontend (Next.js)

- **All files in kebab-case**: `category-form.tsx` not `CategoryForm.tsx`
- **Components use arrow functions**: `const Component = () => {}`
- **Server Components by default**: Only use `"use client"` when needed
- **No React Context**: Use nuqs for URL state, Server Actions for mutations
- **Path aliases**: `~/` maps to `src/`

### Backend (NestJS)

- **Controllers**: Define routes, validate input DTOs, return response DTOs
- **Services**: Contain business logic, database operations
- **DTOs**: Use Zod schemas, export both schema and inferred type
  ```typescript
  export const createProductSchema = z.object({...});
  export type CreateProductDto = z.infer<typeof createProductSchema>;
  ```
- **Soft deletes**: Use `deletedAt: DateTime?` and filter queries with `where: { deletedAt: null }`
- **i18n keys**: Define in `src/i18n/fr/*.json` and `src/i18n/en/*.json`

### Code Style (Biome - Both Projects)

- Tabs for indentation
- Single quotes for strings
- Arrow functions enforced
- Auto-organize imports
- No unused variables

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3020/api
```

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db

# Application
NODE_ENV=development
PORT=3020
API_PREFIX=api

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m

# Frontend CORS
FRONTEND_URL=http://localhost:3000

# WhatsApp
WHATSAPP_PHONE_NUMBER=+33612345678

# UploadThing
UPLOADTHING_TOKEN=your-token

# i18n
DEFAULT_LANGUAGE=fr
```

## Important Notes

### Frontend-Backend Communication
- Frontend calls backend at `NEXT_PUBLIC_API_URL` (default: `http://localhost:3020/api`)
- Frontend `/api/*` routes contain **mock data** as placeholders
- In production, remove mock API routes and connect directly to backend

### Authentication Flow
1. User logs in via `/auth/login` (frontend page)
2. Frontend calls Server Action → backend `/api/auth/login`
3. Backend returns JWT `accessToken`
4. Server Action stores token in httpOnly cookie
5. Future requests automatically attach `Authorization: Bearer <token>`

### Prisma Peculiarities
- Always run `npx prisma generate` after schema changes
- Use `@@map("table_name")` for table naming conventions
- Soft deletes require manual filtering in queries: `where: { deletedAt: null }`

### Testing Credentials (from test-flow.sh)
- Email: `abdulkabore@gmail.com`
- Password: `abdulkabore@gmail.com1@T`
- Role: ADMIN

## Build & Deployment

### Frontend
```bash
cd licences-sale
bun run build
bun start           # Runs optimized production build
```
Configured for `standalone` output (Docker-friendly).

### Backend
```bash
cd licences-sale/licences-api
bun run build       # Compiles to dist/
bun run start:prod  # Runs from dist/main.js
```

Before production deployment:
1. Apply migrations: `npx prisma migrate deploy`
2. Set secure `JWT_SECRET` and `DATABASE_URL`
3. Set `NODE_ENV=production`
4. Configure proper CORS `FRONTEND_URL`
