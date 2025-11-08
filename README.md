# O‑Bun‑Wan (오늘의 분리수거 완료)

Kid-friendly recycling game web app. Next.js 14 + Prisma + SQLite.

## Quick Start

1) Copy env and set secrets

```bash
cp .env.example .env.local
# edit .env.local and set AUTH_SECRET (any random string)
```

2) Install deps (Node or Bun)

```bash
# with npm
npm i

# or with bun
bun install
```

3) Generate Prisma client and migrate

```bash
npx prisma generate
npx prisma migrate dev --name init

# optional demo data
npx tsx prisma/seed.ts
```

4) Run dev server

```bash
npm run dev
# or
bun run dev
```

Open http://localhost:3000

## TFJS COCO‑SSD (browser‑only)

The Recycle page uses TensorFlow.js COCO‑SSD for live detection (no Python/ONNX needed).

- Optional config: `public/models/config.json` with `{ "provider": "tfjs-coco" }`
- Mapping: `public/models/mapping.json` maps COCO labels (e.g., bottle, cup, cardboard) to recycling categories.

## MVP Notes

- Login uses student ID stored in an httpOnly cookie.
- Real-time detection uses TFJS COCO‑SSD (browser, no install). COCO label → recycling category mapping via `public/models/mapping.json`.
- Completing an item records an event and awards points based on category and optional size.
- Leaderboard shows top 20 by total points.

## Next Steps

- Improve mapping.json for your classroom use-case (e.g., bottle→plastic or glass depending on policy).
- Add teacher dashboard and class codes.
- Add i18n (Korean/English).
- Add tests and accessibility passes.
