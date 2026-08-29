# Security — Driving School Management Platform

Status: Phase 0 baseline. This records the security *commitments* the
architecture makes; Phase 13 will re-verify each item against the actual
implementation before launch.

## Passwords
- Hashed with Argon2id (`argon2` npm package), never stored or logged in
  plaintext.
- Minimum password policy enforced server-side at registration/reset
  (length + not-a-known-common-password check at minimum).
- Password reset (admin-initiated per Phase 12) invalidates existing
  sessions/refresh tokens for that user.

## Authentication
- JWT access token, short-lived (e.g. 15 min), sent in an `Authorization:
  Bearer` header — not stored in `localStorage` on the frontend to reduce
  XSS token-theft risk; kept in memory, refreshed via the refresh flow.
- Refresh token stored in an `HttpOnly`, `Secure`, `SameSite=Strict` (or
  `Lax` if cross-site refresh is needed) cookie, so JavaScript cannot read
  it.
- Logout invalidates the refresh token server-side (refresh tokens are
  tracked, not purely stateless, specifically so logout and admin-forced
  logout are real operations).

## Authorization
- Every API route that touches a resource (`Lesson`, `Student`,
  `Message`, `Payment`, etc.) checks **both** authentication (who are you)
  **and** ownership/role (are you allowed to touch *this* record) —
  enforced in middleware/controller, not just hidden in the UI.
- Concretely: a STUDENT role request for `/lessons/:id` must verify
  `lesson.studentId === currentUser.studentProfile.id` before returning
  data, not just verify the JWT is valid. Same pattern for a TEACHER
  request verifying `lesson.teacherId` against their own teacher profile.
- IDs alone are never trusted as authorization — "student cannot access
  another student's data by changing the ID in the URL" is a Phase 15 test
  case, not just a Phase 13 hope.
- ADMIN role bypasses ownership checks by design, but all admin actions
  should be logged (who did what, when) since admin has full access.

## Session / cookie handling
- Cookies: `HttpOnly`, `Secure` (production), `SameSite` set appropriately.
- CSRF: since the access token travels in an `Authorization` header (not
  an ambient cookie used for API auth), classic CSRF risk on state-changing
  API calls is reduced; the refresh cookie endpoint still needs CSRF
  consideration (e.g. double-submit token or restricting the refresh route
  to same-site requests) — finalized in Phase 1 implementation notes.

## Input handling
- All request bodies validated with Zod schemas per endpoint before
  touching business logic — reject unknown/malformed fields rather than
  silently trimming them.
- All database access through Prisma's parameterized query builder — no
  raw string-concatenated SQL. Any raw SQL (e.g. the exclusion constraint
  migration in `DATABASE.md`) is static, parameter-free schema DDL, not
  built from user input.
- Output encoding: React escapes by default; avoid `dangerouslySetInnerHTML`
  entirely unless a specific, reviewed need arises (none currently
  anticipated — messages/notes are plain text).

## Rate limiting & brute force
- Login and password-related endpoints get IP + account-based rate
  limiting (e.g. `express-rate-limit` backed by a store suitable for the
  deployment target).
- Failed login attempts return a generic error ("invalid phone/email or
  password") that doesn't reveal whether the account exists.

## Secrets & configuration
- All secrets (DB connection string, JWT signing secret, etc.) come from
  environment variables, documented in `.env.example` with placeholder
  values only.
- No secrets committed to the repository at any point — `.gitignore`
  excludes `.env` files.
- Initial teacher/admin account is created via a seed script that reads
  credentials from environment variables (or generates a one-time random
  password printed to the console on first run), never a hardcoded value
  in source.

## Data minimization
- Student profile collects only what's operationally needed (per the
  spec's explicit instruction not to over-collect sensitive data) —
  `dateOfBirth`/`address` are optional fields, not required.

## Transport
- HTTPS required in production for both frontend and API; local dev may
  use HTTP on localhost.

## Review checklist (to be executed in Phase 13, re-run before any major release)
- [ ] Password hashing confirmed (no plaintext anywhere, including logs)
- [ ] Auth flows tested (login, logout, refresh, expiry)
- [ ] Authorization boundary tests pass (see `FEATURES.md` Phase 15)
- [ ] Session/cookie flags verified in production build
- [ ] CSRF posture reviewed for cookie-based endpoints
- [ ] XSS review (no unescaped user content rendered)
- [ ] SQL injection review (confirm no raw string SQL with user input)
- [ ] Input validation coverage per endpoint
- [ ] Rate limiting active on auth endpoints
- [ ] No secrets in repo history
- [ ] Dependency vulnerability scan run
- [ ] API responses don't leak more fields than the requesting role should see
