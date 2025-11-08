Deploy to Vercel (with Supabase Postgres)

Overview

- Vercel hosts the Next.js app serverlessly.
- Supabase provides a persistent Postgres DB (SQLite is not suitable for serverless).

Steps

1) Create a Supabase project
   - In Supabase dashboard, create a new project.
   - Copy the Postgres connection string → this is your `DATABASE_URL`.

2) Configure Prisma for Postgres
   - Already updated: `prisma/schema.prisma` uses `provider = "postgresql"`.
   - Locally set `o-bun-wan/.env.local` with:
     - `DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require"`
     - `AUTH_SECRET` and any `NEXT_PUBLIC_*` keys you use.

3) Create DB schema
   - From `o-bun-wan/` run:
     - `npx prisma migrate dev --name init`
     - (Optional) `npm run seed`

4) Push to Vercel
   - Connect GitHub repo to Vercel (or import directly).
   - In Vercel Project → Settings → Environment Variables, add:
     - `DATABASE_URL` → Supabase connection string
     - `AUTH_SECRET` → a long random string
     - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - (Optional) `SUPABASE_SERVICE_ROLE_KEY`, `RECYCLE_AI_URL`
   - Trigger a deploy (push or “Deploy” button).

5) Verify
   - Open your Vercel URL.
   - Login (cookie set) → recycle complete → +100 points → leaderboard shows totals.

Notes

- Prisma Client generation doesn’t require a DB; migrations do. Ensure step 3 completes once before deploying.
- `leaderboard` page and API are dynamic to avoid build-time DB calls.

