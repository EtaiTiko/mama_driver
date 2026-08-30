# Project Status

Last updated: 2026-08-29 (Phase 2 session)

## What has been completed

- **Phase 0 — Project planning: done.** Stack, docs, and repo skeleton.

- **Phase 1 — Database & authentication: code written, NOT yet run or tested.**
  All backend auth infrastructure implemented (see below for details).

- **Phase 2 — Mobile UI foundation: done.**
  
  Implemented:
  - Tailwind CSS configured with RTL support via `tailwindcss-rtl` plugin.
  - Hebrew typography: Rubik (UI) and Lora (display) fonts from Google Fonts.
  - Touch-optimized spacing: minimum 48px touch targets per iOS/Android guidelines.
  - Shared component library (`frontend/src/components/`):
    - `Button` — variants (primary, secondary, ghost, danger), sizes, loading state.
    - `Input` — text input with label, error, helper text; `Textarea` variant.
    - `Select` — dropdown with Hebrew placeholder.
    - `Card` — container with optional header/body/footer subcomponents.
    - `Badge` — status indicators (success, warning, danger, info, default).
    - `Alert` — dismissible alerts with type-specific styling.
    - `BottomNav` — mobile bottom navigation with student/teacher preset variants.
    - `Layout` — `Container`, `Spacer`, `Divider` for consistent spacing.
    - `LoadingStates` — `LoadingSpinner`, `EmptyState` for async states.
  - Demo pages:
    - `LoginPage` — login form with Supabase integration.
    - `StudentDashboard` — student home screen with next lesson, quick actions, stats.
    - `TeacherDashboard` — teacher home screen with schedule, pending requests, stats.
    - `ComponentShowcase` — interactive demo of all UI components.
  - Routing setup in `App.tsx` with React Router.
  - RTL HTML setup (`dir="rtl"`, Hebrew lang tag) in `index.html`.
  - Mobile-first CSS utilities in `index.css`.

## What is currently being worked on

Nothing mid-flight. Phase 2 UI foundation is complete and compiles without errors.

## What remains

- **Phase 1 (blocking):** Actually run the backend:
  - `npm install` in backend, provision Supabase/Postgres
  - `prisma migrate dev` to create migrations
  - `npm run backend:prisma:seed` to create initial admin account
  - `npm run backend:dev` to start the server
  - Test all auth endpoints against a live database

- **Phase 3 onwards:** Student experience, teacher dashboard, calendars, availability management, communications, notifications, payment tracking, admin panel, security review, UX polish, testing.

## Database changes (Phase 1)

- Full schema in `backend/prisma/schema.prisma` — User, Teacher, Student, Lesson, Availability, Messages, Notifications, Payments, Progress, RefreshToken.
- **No migration generated yet** — must run `prisma migrate dev` in Phase 1 real run.

## API endpoints (Phase 1, not yet tested)

- `GET /health`
- `POST /api/auth/login` → `{ accessToken }` + HttpOnly refresh cookie
- `POST /api/auth/refresh` → token rotation
- `POST /api/auth/logout` → revoke refresh token
- `GET /api/auth/me` → current user + role profile

## Frontend setup (Phase 2, complete)

- **Supabase client** (`frontend/src/lib/supabaseClient.ts`) — ready for auth and data queries.
- **Auth hook** (`frontend/src/hooks/useAuth.ts`) — manages session state.
- **Tailwind + RTL** — all utilities support bidirectional text.
- **Component library** — 11 components exported from `frontend/src/components/index.ts`.
- **App routing** — placeholder routes for Phase 3+ feature pages.

## Important technical decisions

1. **Phase 2 focused purely on UI** — no backend integration yet (auth hook connects to Supabase, but login form on ComponentShowcase page is demo-only).
2. **Bottom navigation variants** — `StudentBottomNav` (4 items) vs `TeacherBottomNav` (5 items) to match role-specific UX.
3. **Touch-friendly defaults** — all interactive elements 48px+ in height (3rem), following mobile accessibility standards.
4. **Hebrew-first design** — fonts, RTL layout, Hebrew labels in demo components.

## Known limitations

- Phase 2 UI is not yet connected to Phase 1 backend (happens in Phase 3).
- ComponentShowcase page uses demo data; real data comes after Phase 3.
- No error handling wired to real API yet (placeholder only).
- Mobile responsiveness tested conceptually; real device testing happens in Phase 14.

## Next recommended action

1. **Run Phase 1 for real** (npm install, provision DB, migrate, seed, start backend).
2. **Test all auth endpoints** against live database.
3. **Begin Phase 3** (wire frontend UI to actual backend + Supabase auth).

## What has been completed

- **Phase 0 — Project planning: done.** (See prior entry, unchanged —
  stack, docs, repo skeleton.)

- **Phase 1 — Database & authentication: code written, NOT yet run or
  tested.** Read the "Environment constraints" section below before
  trusting anything in this section further than "compiles."

  Implemented:
  - `backend/prisma/schema.prisma` — full schema per `docs/DATABASE.md`:
    `User`, `Teacher`, `Student`, `Lesson`, `TeacherAvailability`,
    `AvailabilityException`, `Message`, `Notification`, `Payment`,
    `LessonProgress`, plus `RefreshToken` (added during this phase, see
    "Important technical decisions").
  - `backend/src/lib/env.ts` — zod-validated environment config, fails
    fast on missing/short secrets instead of silently signing JWTs with
    `undefined`.
  - `backend/src/lib/prisma.ts` — shared Prisma client singleton.
  - `backend/src/lib/password.ts` — Argon2id hash/verify helpers.
  - `backend/src/lib/jwt.ts` — access token sign/verify, opaque refresh
    token generation + hashing + expiry calculation.
  - `backend/src/middleware/auth.ts` — `requireAuth`, verifies the
    `Authorization: Bearer` access token.
  - `backend/src/middleware/roleGuard.ts` — `requireRole(...)`, role
    checks only (resource-ownership checks are per-route, added as those
    routes get built in later phases).
  - `backend/src/middleware/errorHandler.ts` — centralized JSON error
    responses, including Zod validation errors.
  - `backend/src/validation/auth.ts` — login request validation.
  - `backend/src/services/authService.ts` — login, refresh-token
    rotation, revoke-on-logout.
  - `backend/src/routes/auth.ts` — `POST /api/auth/login`,
    `POST /api/auth/refresh`, `POST /api/auth/logout`,
    `GET /api/auth/me` (example protected route).
  - `backend/src/index.ts` — wired up (cors, json body parsing, cookies,
    `/health`, `/api` router, error handling).
  - `backend/prisma/seed.ts` — creates the first ADMIN account from
    `INITIAL_ADMIN_PHONE` / `INITIAL_ADMIN_PASSWORD` env vars; generates
    and prints a one-time random password if none is provided. No
    hardcoded password anywhere.

  Verification actually performed: an offline TypeScript compile check
  (see "Verification method" below) — nothing more.

## Environment constraints for this session (read before continuing)

This session ran in a sandbox with:
- **No network access** (`npm install` against the real npm registry
  returns `403 host_not_allowed`) — so none of the packages in
  `backend/package.json` (`express`, `@prisma/client`, `argon2`,
  `jsonwebtoken`, `zod`, `express-rate-limit`, etc.) are actually
  installed, and Prisma's query-engine binaries (also fetched over the
  network) could not be downloaded.
- **No Postgres instance.**
- No persistence between chat sessions in this interface — this
  scaffold only exists because it was written to a zip file the user
  downloads and moves to a real machine/repo.

### Verification method actually used (and its limits)
Real code could not be run, so verification was: copy `backend/src` to a
scratch directory, add hand-written ambient `declare module` stubs for
every external package (typed as `any`), and run `tsc --noEmit` against
that. This is a genuine, useful check — it caught one real bug (see
below) — but it does **not** verify:
- That the code actually runs under Node.
- That Prisma's generated types match how the code queries the database
  (the stub typed `@prisma/client` as `any`, so e.g. a typo'd field name
  in a `prisma.user.findUnique({ where: { ... } })` call would not have
  been caught).
- That `argon2`'s native module compiles/loads correctly.
- That any request/response actually round-trips correctly.

**Bug the offline check did catch and fix:** `backend/tsconfig.json` uses
`"module": "NodeNext"` / `"moduleResolution": "NodeNext"`, which requires
relative imports to use an explicit `.js` extension even though the
source files are `.ts` (a well-known Node ESM + TypeScript requirement).
Every relative import across `backend/src` and `backend/prisma/seed.ts`
was missing this and has been fixed.

## What is currently being worked on

Nothing mid-flight. Phase 1 code is written; the next session should
**run it for real** before writing any more feature code (see "Next
recommended action").

## What remains

- Actually running Phase 1: `npm install`, provision Postgres, run
  `prisma migrate dev`, run the seed script, start the server, and test
  every endpoint against a real database.
- Fixing whatever the above surfaces — there will likely be at least
  minor issues, since none of this has touched a real database or a real
  `@prisma/client` yet.
- Phases 2 through 16, entirely (see `docs/FEATURES.md`).

## Database changes

- Full schema implemented in `backend/prisma/schema.prisma` (see above).
- **No migration has been generated or run** — `backend/prisma/migrations`
  does not exist yet. That is the literal next command to run.

## API endpoints created

All implemented, none tested against a live server:
- `GET /health`
- `POST /api/auth/login` — body `{ phone, password }` → `{ accessToken }`,
  sets an HttpOnly `refreshToken` cookie scoped to `/auth`.
- `POST /api/auth/refresh` — reads the refresh cookie, rotates it,
  returns a new `{ accessToken }`.
- `POST /api/auth/logout` — revokes the refresh token, clears the cookie.
- `GET /api/auth/me` — requires `Authorization: Bearer <accessToken>`,
  returns the current user + role-specific profile ids.

## Important technical decisions

1. **Separate frontend/backend, JWT + HttpOnly refresh cookie, UTC
   storage** — carried over from Phase 0, see prior entries in
   `docs/ARCHITECTURE.md` / `docs/SECURITY.md`.
2. **Added a `RefreshToken` table** (not in the original `DATABASE.md`
   draft) so refresh tokens are individually revocable server-side —
   logout and forced-logout are real operations, not just "the client
   deleted its cookie." Tokens are opaque random strings; only their
   SHA-256 hash is stored, and they rotate on every use.
3. **Central `env.ts` with zod validation** — the app refuses to start
   rather than silently running with a missing/weak JWT secret.
4. **Login errors are deliberately generic** ("phone or password
   incorrect") regardless of whether the phone number exists, per
   `docs/SECURITY.md`.
5. Kept the offline-verification limits explicit in this file rather
   than implicitly "passing" Phase 1 — per the master spec's rule to
   never claim something is finished without testing it.

## Known bugs

None *known* — but see "Environment constraints" above: this has not run
against Node, Postgres, or the real `@prisma/client`, so undiscovered
issues (a typo'd Prisma field name, a cookie option Express rejects, an
argon2 native-build issue, etc.) are entirely possible and should be
expected and fixed in the first real run, not treated as a surprise.

## Next recommended action

In an environment with network access and a Postgres instance (Claude
Code, or your own machine):

1. `npm install` at the repo root.
2. `cp .env.example .env` and fill in real values — a real
   `DATABASE_URL`, long random `JWT_ACCESS_SECRET` /
   `JWT_REFRESH_SECRET`, and `INITIAL_ADMIN_PHONE`.
3. `cd backend && npx prisma migrate dev --name init` — this will very
   likely surface at least minor issues (e.g. the `AvailabilityException`
   model's `@db.Date` annotation, or Decimal field defaults) since the
   schema has never been run through Prisma. Fix whatever comes up.
4. `npm run prisma:seed` — confirm the admin account is created and
   capture the printed password if one was generated.
5. `npm run dev` and manually exercise `/api/auth/login`,
   `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/me` with curl or
   Postman. Confirm: wrong password is rejected, inactive user is
   rejected, refresh rotation actually issues a new cookie and revokes
   the old one, logout actually prevents the old refresh token from
   working.
6. Only once all of that is confirmed working, update this file marking
   Phase 1 items ☑ instead of ◐, and move on to Phase 2 (Mobile UI
   Foundation).
