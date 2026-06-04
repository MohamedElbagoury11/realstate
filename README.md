# EstateHub — Real Estate Marketplace

Production-ready real estate platform built with **Next.js App Router**, **TypeScript**, and **clean architecture**. Firebase is used only as the initial data provider and can be swapped for NestJS, Supabase, PostgreSQL, etc. without rewriting business logic or UI.

## Architecture

| Layer | Path | Responsibility |
|-------|------|----------------|
| Types | `src/types/` | Domain models |
| Repositories | `src/repositories/` | Data access interfaces + `firebase/` implementations |
| Services | `src/services/` | Business rules, permissions, validation |
| Providers | `src/providers/` | Firebase wiring + DI containers |
| UI | `app/`, `src/components/` | Pages and components (no Firebase imports) |

## Roles

- **Admin** — approve sellers/properties, analytics, full access
- **Seller** — list properties after admin approval
- **Customer** — browse and search approved listings

## Internationalization (i18n)

- **Library:** [next-intl](https://next-intl.dev) with App Router locale prefix (`/en`, `/ar`)
- **Messages:** `messages/en/*.json` and `messages/ar/*.json` (namespaces: `common`, `auth`, `public`, `property`, `admin`, `seller`, `validation`, `errors`, `metadata`)
- **RTL:** Arabic sets `dir="rtl"` and `lang="ar"` on `<html>`
- **Language switcher:** header toggle (EN / AR), persisted via `NEXT_LOCALE` cookie
- **SEO:** dynamic metadata + `hreflang` alternates per locale

Default locale: `en`. Visiting `/` redirects to `/en` via middleware.

## Routes

- `/[locale]/(public)/` — home, search, property detail (SEO + JSON-LD, platform contact CTAs)
- `/[locale]/(auth)/` — login, register
- `/[locale]/seller/dashboard` — create, edit, delete listings
- `/seller/dashboard/properties/[id]/edit` — edit own property
- `/[locale]/admin/dashboard` — property analytics
- `/[locale]/admin/properties` — moderation (pending / approved / rejected / hidden)
- `/[locale]/admin/properties/[id]` — edit any property + seller info (admin only)
- `/[locale]/admin/leads` — lead analytics (WhatsApp / call clicks)
- `/[locale]/admin/settings` — platform contact phone, WhatsApp, email
- `/[locale]/admin/audit` — admin action audit log
- `/[locale]/admin/users` — seller approvals

## Analytics & engagement

- **Property views** — tracked per session on detail pages; stored on `viewCount`
- **Leads** — WhatsApp/call clicks increment `leadCount` and notify sellers
- **Conversion** — admin dashboard and leads page show views → contacts %
- **Seller notifications** — approval, rejection, hidden, leads, reports
- **Share / report** — on property detail pages
- **Featured listings** — `featured`, `featuredUntil`, `featuredPriority` (admin-only)

## Setup

1. Copy `.env.example` to `.env.local` and fill Firebase values. Set `SESSION_SECRET` (32+ random characters) for signed session cookies.
2. Enable Email/Password auth in Firebase Console.
3. Create a [Cloudinary](https://cloudinary.com) account and add `CLOUDINARY_*` vars to `.env.local` (Dashboard → API Keys).
4. Deploy Firestore rules: `firebase deploy --only firestore:rules`
4. Create the first admin manually in Firestore `users/{uid}`:

```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "role": "admin",
  "approved": true,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

Use the Firebase Auth UID as the document ID (register the user first, then update the document).

5. Install and run:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint

## Images (Cloudinary)

Property photos upload via **Cloudinary**, not Firebase Storage. Implementation: `src/repositories/cloudinary/image.repository.ts`. The `ImageService` and UI are unchanged.

## Migrating off Firebase

Replace implementations under `src/repositories/firebase/` with `src/repositories/api/` (or similar) and update `container.server.ts` / `container.client.ts`. Services, types, and UI remain unchanged. Image uploads already use Cloudinary.

## SEO

- Dynamic metadata and OpenGraph on property pages
- `schema.org` RealEstateListing JSON-LD
- `app/sitemap.ts` and `app/robots.ts`
- Canonical URLs via `src/lib/seo.ts`
