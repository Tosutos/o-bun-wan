Deploy with Docker

Prerequisites

- Install Docker Desktop (Windows/Mac) or Docker Engine (Linux).

One‑time setup

- In `o-bun-wan/`, create `.env.docker` from the example:
  - Copy `.env.docker.example` → `.env.docker`
  - Fill values (at minimum set a random `AUTH_SECRET`).

Quick start (local)

- From `o-bun-wan/` directory:
  - Build image: `docker compose build`
  - Start app: `docker compose --env-file .env.docker up -d`
  - Open: http://localhost:3000

What this does

- Uses SQLite at `file:/app/data/dev.db` inside the container.
- Persists DB at named volume `obw_data`.
- Runs `prisma migrate deploy` on container start.

Stop/Start/Logs

- Stop: `docker compose down`
- Start: `docker compose --env-file .env.docker up -d`
- Logs (follow): `docker compose logs -f`

Updating the app

- Pull latest code, then:
  - `docker compose build`
  - `docker compose --env-file .env.docker up -d`

Deploying to a server

- Copy this folder (`o-bun-wan/`) to the server or push to a repo and pull.
- Install Docker on the server.
- Create `.env.docker` with your secrets on the server.
- Run the same commands as local.
- Optionally set up reverse proxy (e.g., Caddy/Nginx) for TLS and a domain.

Environment variables

- DATABASE_URL is set by compose to `file:/app/data/dev.db`.
- Provide `AUTH_SECRET` and any `NEXT_PUBLIC_*` keys via `.env.docker`.

