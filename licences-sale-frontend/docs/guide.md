# Guide Next.js (a completer)

Ce document va servir de reference pour une IA chargee de generer le frontend Next.js.
On le completera progressivement avec les bonnes pratiques, conventions, et exigences.

## Objectif

- Produire un frontend Next.js propre, maintenable et conforme a nos standards.

## package Manager
bun pour tout. installation, test, etc...

## Stack obligatoire
- Validation: Zod
- Actions serveur: next-safe-action
- Gestion des params URL: nuqs
- Dates: date-fns
- Notifications: sonner
- HTTP client: axios avec intercepteurs globaux
  - Fichier: `~/lib/api.ts`
  - Doit exposer `api` qui ajoute automatiquement le token d'authentification si present
  - `api.ts` contient uniquement le setup (client axios + helpers)
  - Les appels API metier doivent vivre dans un `lib.ts` proche des actions
    - Auth: `~/app/auth/login/lib.ts` et `~/app/auth/register/lib.ts`
    - Admin: `~/app/admin/**/lib.ts` (utilise par `actions.ts`)

## Rendu et data fetching

- Toutes les pages `page.tsx` sont des Server Components.
- Les fetch initiaux doivent etre effectues cote serveur.
- Tous les appels API cote client doivent passer par des Server Actions via `next-safe-action`.
- Si une page a des recherches/filters, utiliser `nuqs` pour gerer les search params, y compris les valeurs initiales.

## Validation

- Le dossier `~/validators` doit contenir les schemas de validation.

## Etat global

- Ne jamais utiliser React Context.

## Conventions de fichiers

- Tous les fichiers doivent etre en kebab-case (pas de PascalCase).
- Pages et composants: utiliser des fonctions flechees, pas de fonctions classiques.

## Session

- La session doit etre stockee dans les cookies (jamais localStorage ou sessionStorage).
- Fichier recommande: `~/lib/session.ts` avec `use server`.
- Exemples attendus (a adapter si besoin):
  - `getSession()` appelle `getMeApi()` et redirige si token invalide.
  - `setSessionToken()` pose un cookie `auth_token` (httpOnly, sameSite, maxAge 8 jours).
  - `clearSession()` supprime le cookie.
  - `getToken()` lit la valeur du cookie.

## Administration

- Un `layout.tsx` dans `/admin/` gere la verification de session et role admin (redirection si non autorise).
- D'autres `layout.tsx` peuvent etre utilises pour verifier les sessions selon les sections, sans React Context.

## Organisation des pages (exemple)

- Page principale: `/products/page.tsx`
- Actions server: `/products/actions.ts`
- Appels API de la page: `/products/lib.ts`
- Search params (nuqs): `/products/search/params.tsx`
- Tous les composants de `products/` doivent etre dans `products/components`.
- Pour une route dynamique `products/[slug]`, les composants vont dans `/products/[slug]/components` etc...
