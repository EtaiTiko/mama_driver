# Features & Phase Roadmap — Driving School Management Platform

This tracks the phase plan from the master prompt and will be checked off
as work lands. It's the "what" companion to `PROJECT_STATUS.md` (the
"where we are right now").

Legend: ☐ not started · ◐ in progress · ☑ done

## Phase 0 — Project planning
☑ Architecture decided and documented
☑ Core docs created (this file, ARCHITECTURE, DATABASE, SECURITY)
☑ Repo skeleton created (frontend/backend workspaces, config files)

## Phase 1 — Database & authentication
◐ Prisma schema implemented per `DATABASE.md` — written, **not yet migrated
  against a real database** (this sandbox has no Postgres and no network
  to fetch Prisma's engine binaries)
☐ Initial migration — blocked until run in an environment with Postgres + network
◐ Argon2id password hashing — code written, **not run** (argon2 needs a
  native module compiled via `npm install`, not possible here)
◐ Login / logout — implemented (`POST /api/auth/login`, `/logout`), not run
◐ JWT access token + refresh cookie (rotation on every refresh, revocable
  via `RefreshToken` table) — implemented, not run
◐ Role-based route guards (STUDENT / TEACHER / ADMIN) — implemented
  (`requireAuth` + `requireRole` middleware), not run
◐ Initial teacher/admin account creation via seed script + env vars (no
  hardcoded password) — implemented (`backend/prisma/seed.ts`), not run

Every ◐ item above passed an offline TypeScript compile check (see
`PROJECT_STATUS.md`) but has **not** been executed against a real
database, per the master spec's rule against claiming something is done
before it's implemented *and* tested. That test pass is the very next
step, in an environment with network + Postgres access.

## Phase 2 — Mobile UI foundation
☐ Tailwind + RTL base configured
☐ Hebrew typography chosen (readable at small sizes)
☐ Bottom navigation (student + teacher variants)
☐ Shared component library: buttons, cards, inputs sized for touch

## Phase 3 — Student experience
☐ Student dashboard (next lesson, quick actions, notifications)
☐ Slot browsing UI
☐ Lesson request flow
☐ Lesson cancellation flow (policy-aware)

## Phase 4 — Teacher dashboard
☐ Today's lessons, pending requests, upcoming, cancellations, unread messages, student count
☐ Accept / decline (with optional reason) / cancel / complete / no-show actions

## Phase 5 — Calendar
☐ Teacher day/week (month optional) views
☐ Student week/date picker + slot list
☐ Visual status distinction (accepted/pending/unavailable/completed/cancelled)

## Phase 6 — Teacher availability management
☐ Weekly recurring schedule editor
☐ Unavailable date exceptions
☐ Exceptional available date entries

## Phase 7 — Student management
☐ Teacher-facing student list
☐ Student profile page (details, lesson history, notes)

## Phase 8 — Communication
☐ 1:1 chat UI (student <-> teacher)
☐ Unread counts, read receipts, timestamps, autoscroll

## Phase 9 — Notifications
☐ In-app notification feed
☐ Triggers wired to lesson lifecycle + messages
☐ Read/unread state
☐ Architecture leaves room for email/SMS/push (not implemented yet)

## Phase 10 — Lesson history & progress
☐ Per-lesson progress recording (topics, notes, assessment)
☐ Student-facing progress view

## Phase 11 — Payments (tracking only)
☐ Teacher view: unpaid/paid, totals owed/paid
☐ Student view: balance, history
☐ No payment provider integration (explicitly out of scope until requested)

## Phase 12 — Administration
☐ Admin: create teachers/students, deactivate accounts, reset passwords
☐ System stats
☐ Multi-teacher support validated end-to-end

## Phase 13 — Security review
☐ Checklist pass (see `SECURITY.md`)

## Phase 14 — UX polish
☐ Cross-device pass (phones, tablets, desktop), RTL edge cases

## Phase 15 — Testing
☐ Auth tests
☐ Scheduling/double-booking tests
☐ Authorization boundary tests
☐ DB relationship tests

## Phase 16 — Deployment
☐ `.env.example` finalized
☐ Deployment docs (DB setup, migrations, seed, dev/prod build)

---

## Feature notes carried over from the spec (not yet scheduled into a sub-task)

- WhatsApp integration: explicitly deferred, not part of any phase yet.
- Multiple teachers: schema supports it from Phase 1; full admin UX for it
  lands in Phase 12.
- Timezone configurability: a `Teacher.timezone` field from Phase 1 on,
  not hardcoded in scheduling logic.
