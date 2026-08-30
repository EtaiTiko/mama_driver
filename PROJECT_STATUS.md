# Project Status

Last updated: 2026-08-30 (Phase 3 session)

## What has been completed

- **Phase 0 — Project planning: done.** Stack, docs, and repo skeleton.

- **Phase 1 — Database & authentication: code written, NOT yet run or tested.**
  All backend auth infrastructure implemented.

- **Phase 2 — Mobile UI foundation: done.**
  Complete component library, RTL support, Hebrew typography, routing setup.

- **Phase 3 — Student experience: done.**
  
  Implemented:
  - Lesson types and enums (`frontend/src/types/lesson.ts`).
  - Lesson management hook (`frontend/src/hooks/useLessons.ts`):
    - `fetchMyLessons()` — retrieve student's lessons
    - `fetchAvailableSlots()` — browse available slots from teachers
    - `requestLesson()` — create a lesson request
    - `cancelLesson()` — cancel an accepted/pending lesson
    - `getNextLesson()` — get the next upcoming lesson
    - `getLessonStats()` — aggregated stats (completed, pending, accepted, cancelled)
    - Mock data generator for testing (will be replaced with real API calls)
  - Student UI pages:
    - `BrowseLessonsPage` — search and filter available lesson slots by teacher/date
    - `BookLessonPage` — lesson request form with teacher details confirmation
    - `MyLessonsPage` — student's lesson history with tabs (upcoming/past/cancelled)
    - Updated `StudentDashboard` — integrated with `useLessons` hook, shows next lesson + stats
  - Routing in `App.tsx`:
    - `/student/lessons` — my lessons list
    - `/student/lessons/browse` — browse and search available slots
    - `/student/lessons/book/:slotId` — book a specific slot
  - Features:
    - Lesson request workflow (pending → accepted → completed)
    - Lesson cancellation (with reason tracking)
    - Teacher ratings and lesson history display
    - Status-based filtering (upcoming, past, cancelled)
    - Mock data with 30 days of available slots and 3 teachers

## What is currently being worked on

Nothing mid-flight. Phase 3 student experience is complete with UI flows and mock data integration.

## What remains

- **Phase 1 (blocking):** Actually run the backend:
  - `npm install` in backend, provision Supabase/Postgres
  - `prisma migrate dev` to create migrations
  - `npm run backend:prisma:seed` to create initial admin account
  - `npm run backend:dev` to start the server
  - Test all auth endpoints

- **Phase 3→4 transition:** Wire frontend to real backend API:
  - Replace mock data generators in `useLessons` with real API calls
  - Connect to actual teacher availability data
  - Test lesson request/cancellation flows against live database

- **Phase 4 onwards:** Teacher dashboard, calendars, availability management, communications, notifications, payments, admin panel, security review, UX polish, testing, deployment.

## Database changes (Phase 1)

- Full schema in `backend/prisma/schema.prisma` — User, Teacher, Student, Lesson, Availability, Messages, Notifications, Payments, Progress, RefreshToken.
- **No migration generated yet** — must run `prisma migrate dev` in Phase 1 real run.

## API endpoints (Phase 1, not yet tested)

- `GET /health`
- `POST /api/auth/login` → `{ accessToken }` + HttpOnly refresh cookie
- `POST /api/auth/refresh` → token rotation
- `POST /api/auth/logout` → revoke refresh token
- `GET /api/auth/me` → current user + role profile

**Phase 3 (placeholders, need backend implementation):**
- `GET /api/lessons/my-lessons` → student's lessons
- `GET /api/lessons/available-slots` → filterable teacher availability
- `POST /api/lessons/request` → create lesson request
- `POST /api/lessons/:id/cancel` → cancel lesson

## Frontend setup (Phase 3, core features complete)

- **Supabase client** (`frontend/src/lib/supabaseClient.ts`) — ready for auth and data queries.
- **Auth hook** (`frontend/src/hooks/useAuth.ts`) — manages session state.
- **Lesson management hook** (`frontend/src/hooks/useLessons.ts`) — lesson CRUD and filtering (mock data).
- **Tailwind + RTL** — all utilities support bidirectional text.
- **Component library** — 11 base components + 3 lesson-specific pages.
- **App routing** — 6 active routes (login, student dashboard, lessons list/browse/book, showcase).
- **Running dev server** — `npm run dev:frontend` on http://localhost:5174.

## Important technical decisions

1. **Phase 3 focused on student UI flows** — mock data replaces backend calls, ready to wire to real API.
2. **Lesson status enum** — matches database schema (PENDING, ACCEPTED, DECLINED, CANCELLED_BY_*, COMPLETED, NO_SHOW).
3. **Hook-based data management** — `useLessons` isolates API logic, easy to test/replace with real calls.
4. **Filtering at UI level** — client-side filters for now; server-side filtering added in Phase 4.
5. **Lesson request workflow** — no payment/payment provider integration (explicitly out of scope per spec).

## Known limitations

- **Phase 3 uses mock data** — no real backend yet. Replace fetch calls in `useLessons` hook when backend is ready.
- **No real-time updates** — lesson list doesn't auto-refresh when teacher accepts. Will use WebSocket/polling in Phase 8+.
- **No teacher selection by student** — slots are offered by teacher; student can filter but not directly request a specific teacher.
- **Date picker is text-based** — mobile date picker will be added in Phase 14 UX polish.

## Next recommended action

1. **Run Phase 1 for real** (npm install backend, provision Supabase, migrate, seed, start server).
2. **Test all auth endpoints** against live database.
3. **Wire Phase 3 to real backend:**
   - Update `useLessons` hook fetch calls to point to `/api/lessons/*` endpoints
   - Test lesson request/cancellation workflows end-to-end
4. **Begin Phase 4** (teacher dashboard, schedule acceptance/rejection, real-time notifications).

## Files created/modified in Phase 3

**New files:**
- `frontend/src/types/lesson.ts` — type definitions
- `frontend/src/hooks/useLessons.ts` — lesson management logic
- `frontend/src/pages/BrowseLessonsPage.tsx` — search/filter available slots
- `frontend/src/pages/BookLessonPage.tsx` — lesson request form
- `frontend/src/pages/MyLessonsPage.tsx` — lesson history and management

**Modified files:**
- `frontend/src/App.tsx` — added 3 new routes
- `frontend/src/pages/StudentDashboard.tsx` — integrated useLessons hook, real data display
- `PROJECT_STATUS.md` — this file
- `docs/FEATURES.md` — updated Phase 3 checklist
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
