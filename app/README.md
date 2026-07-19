# RV Sales Mission Control

A minimal Next.js dashboard for RV dealership operations with sample data fallback and Supabase-ready authentication.

## Local development

```bash
cd /app
npm install
cp .env.example .env.local
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. Copy the project URL and the anonymous / publishable key into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-or-publishable-key>
```

3. Open the Supabase SQL editor and run the schema file:

```bash
/app/supabase/schema.sql
```

4. In Supabase Auth, enable Email sign-in.
5. In the database, confirm the `auth.users` table is available and that the `profiles` table is linked via `id`.
6. Add any required storage or RLS policies for your dealership ownership model.

## Authentication behavior

- The app redirects unauthenticated users to `/login`.
- The login page uses email and password sign-in.
- The dashboard keeps its existing visual design and automatically falls back to sample data when Supabase is not configured or the database tables are unavailable.

## Verification

```bash
npm run lint
npm run build
```
