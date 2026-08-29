# מערכת ניהול בית ספר לנהיגה — Driving School Management Platform

A mobile-first, Hebrew/RTL web application for a driving instructor and
their students: scheduling, availability, lesson requests, messaging,
progress tracking, and payment tracking.

This repository is being built in phases. See:
- [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) — **read this first**, every
  session. Current state, what's next.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — stack & structure.
- [`docs/DATABASE.md`](./docs/DATABASE.md) — data model.
- [`docs/FEATURES.md`](./docs/FEATURES.md) — phase-by-phase roadmap.
- [`docs/SECURITY.md`](./docs/SECURITY.md) — security commitments & checklist.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS (RTL, mobile-first)
- **Backend:** Node.js + TypeScript + Express
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT access token + HttpOnly refresh cookie, Argon2id password hashing

## Repository layout

```
/frontend   - React SPA (deployable independently)
/backend    - Express API + Prisma (deployable independently)
/docs       - architecture, database, features, security docs
```

## Getting started (once Phase 1 lands)

This section will be filled in as the database, auth, and build tooling
are implemented. For now:

```bash
# from repo root
npm install          # installs frontend + backend workspaces
cp .env.example .env # fill in real values, never commit .env
```

Database setup, migrations, seeding, and running dev servers will be
documented here as soon as Phase 1 (database & auth) is implemented —
see `PROJECT_STATUS.md` for exactly what exists right now.

## Development workflow

At the start of every work session:
1. Read `PROJECT_STATUS.md`.
2. Read whichever `docs/*.md` file is relevant to the task at hand.
3. Inspect the current code before writing new code.
4. Continue from the last unfinished task — don't restart or rebuild
   working functionality.

At the end of every session, `PROJECT_STATUS.md` is updated with what
changed, what's next, and any new database/API/technical decisions.

## Language conventions

- All user-facing text: Hebrew, RTL layout.
- All code, identifiers, comments, and commit messages: English.
