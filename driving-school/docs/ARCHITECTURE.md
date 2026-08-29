# Architecture — Driving School Management Platform

Status: Phase 0 (planning). No feature code has been written yet.

## 1. Goals driving the architecture

- Hebrew-first, RTL, mobile-first UI.
- Clear separation between frontend, backend, and database so each can be
  deployed and scaled independently.
- A backend that is the single source of truth for scheduling logic —
  the frontend never decides whether a slot is available.
- Room to grow from "one teacher" to "multiple teachers" without a schema
  rewrite.
- Small, boring, well-understood technology choices over novelty, since a
  single instructor will likely need to maintain this long-term.

## 2. Stack decision

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + TypeScript + Vite | SPA is enough (no SEO requirement for a login-gated scheduling app); Vite gives fast local dev and a plain static build that deploys anywhere (Netlify/Vercel/S3/nginx) independent of the backend. Next.js was considered but rejected for v1 because we don't need SSR/SEO, and a separate API keeps the "deploy independently" requirement simple and explicit. |
| Styling | Tailwind CSS | Utility-first, easy to keep consistent spacing/typography on small screens, built-in RTL-friendly logical properties when configured correctly. |
| Backend | Node.js + TypeScript + Express | Explicit routing, explicit middleware for auth/authorization — easier to audit for the security requirements (Phase 13) than a more implicit framework. |
| Database | PostgreSQL | Relational integrity (foreign keys, transactions) is essential for preventing double-booked lessons. |
| ORM | Prisma | Type-safe queries, migrations, and a schema file that doubles as living documentation of the data model. |
| Auth | JWT access token (short-lived) + HTTP-only refresh cookie | Stateless-ish auth that still allows secure logout/rotation. Passwords hashed with Argon2id. |
| Validation | Zod (shared shape between frontend forms and backend request validation) | Keeps validation rules in one place per endpoint. |

### Why not Next.js full-stack?
It's a reasonable alternative and would reduce boilerplate. We're choosing
separate frontend/backend because the spec explicitly asks for independent
deployability, and because a plain Express API is easier to reason about for
per-route authorization checks (a core security requirement here — students
must never reach another student's data).

### Why not a BaaS (Supabase/Firebase) for v1?
Would speed up delivery, but the scheduling/availability engine has
non-trivial business logic (recurring availability, exceptions, race-safe
booking) that's easier to control precisely in application code with
Postgres transactions than to express purely in row-level-security rules.
Nothing here rules out layering Supabase-hosted Postgres in later as a
*hosting* choice — that's an infra decision, not an architecture one.

## 3. High-level system diagram

```
┌─────────────────────────┐        HTTPS/JSON        ┌──────────────────────────┐
│   Frontend (React SPA)  │  ───────────────────────▶ │   Backend (Express API)  │
│   Vite build, static    │ ◀───────────────────────  │   Node + TypeScript      │
│   hosting               │                            │                          │
└─────────────────────────┘                            └────────────┬─────────────┘
                                                                     │ Prisma (SQL)
                                                                     ▼
                                                          ┌──────────────────────┐
                                                          │   PostgreSQL          │
                                                          └──────────────────────┘
```

The frontend never talks to the database directly. All reads/writes to
scheduling, users, messages, etc. go through the API, which enforces
authentication + authorization + business rules (e.g. "is this slot really
free") before touching the database.

## 4. Repository layout (monorepo, two deployable units)

```
/driving-school
  /frontend                 -> deployable independently (static build)
    /src
      /pages
      /components
      /features             (booking, availability, messages, etc.)
      /lib                  (api client, auth context, date/time helpers)
      /hooks
      /types
      /styles
    index.html
    vite.config.ts
    tailwind.config.js
    tsconfig.json
    package.json

  /backend                  -> deployable independently (Node process)
    /src
      /routes
      /controllers
      /services             (scheduling engine, notifications, etc.)
      /middleware           (auth, role guards, error handling, rate limiting)
      /lib                  (prisma client, argon2 helpers, jwt helpers)
      /validation           (zod schemas per endpoint)
      index.ts
    /prisma
      schema.prisma
      /migrations
    tsconfig.json
    package.json

  /docs
    ARCHITECTURE.md
    DATABASE.md
    FEATURES.md
    SECURITY.md

  PROJECT_STATUS.md
  README.md
  .env.example
  package.json             (root — npm workspaces, shared scripts)
```

`frontend` and `backend` are npm workspaces so `npm install` at the root
installs both, but each has its own `package.json`/build/deploy pipeline —
either can be deployed on its own host.

## 5. Environments & configuration

- Configuration via environment variables only (see `.env.example`).
- Timezone: the app targets `Asia/Jerusalem` for display, but the database
  stores timestamps in UTC (Postgres `timestamptz`) and the timezone is a
  configurable value, not hardcoded into scheduling logic, per the spec's
  requirement to support timezone configuration.
- Three standard environments: `development`, `test`, `production`. `test`
  uses a separate database so automated tests never touch dev/prod data.

## 6. Cross-cutting concerns

- **Scheduling engine** lives entirely in the backend (`services/scheduling`)
  and is the only code path allowed to decide slot availability. It is
  designed so booking is done inside a single database transaction with a
  row-level lock (or a unique constraint as a backstop) to prevent two
  students from booking the same slot concurrently. Full design is deferred
  to Phase 1/3 — flagged here because it's the riskiest piece of the system.
- **Authorization** is enforced with middleware that checks role + resource
  ownership on every request (not just at the UI level). Documented further
  in `SECURITY.md`.
- **Notifications** are stored in the database first (in-app notification
  feed) with the sending layer abstracted so email/SMS/push can be added
  later without changing call sites (see `FEATURES.md`).

## 7. What Phase 0 does *not* decide yet

Deliberately deferred to later phases so this document doesn't get ahead of
implementation:
- Exact Prisma schema (drafted in `DATABASE.md`, finalized in Phase 1).
- Hosting provider choice for frontend/backend/DB (a deployment detail,
  addressed in Phase 16).
- Whether refresh tokens are stored server-side (session table) or are
  purely stateless — to be decided in Phase 1 alongside the auth
  implementation, documented there when built.
