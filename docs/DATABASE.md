# Database Design — Driving School Management Platform

Status: Phase 0 draft. This describes the *planned* schema so Phase 1 has a
clear spec to implement against in `backend/prisma/schema.prisma`. Field
names are English; nothing here is implemented yet.

General rules applied throughout:
- Primary keys: `String @id @default(cuid())` (avoids leaking sequential
  IDs, avoids a round trip for ID generation).
- All timestamps stored as UTC (`DateTime` / Postgres `timestamptz`).
- Every foreign key gets an index; every table gets `createdAt`; mutable
  tables get `updatedAt`.
- Soft-disable via `active: Boolean` rather than hard delete for `User`,
  `Teacher`, `Student` — driving lesson history must survive account
  deactivation.

## Entities

### User
Anyone who can log in.

| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| firstName | String | |
| lastName | String | |
| phone | String | unique, used for login/contact |
| email | String? | unique if present, optional |
| passwordHash | String | Argon2id hash, never plaintext |
| role | Enum: TEACHER, STUDENT, ADMIN | |
| active | Boolean | default true |
| createdAt | DateTime | |
| updatedAt | DateTime | |

`Teacher` and `Student` are 1:1 profile extensions of `User` (not
duplicating auth fields), so a person's login identity is separate from
their role-specific profile data.

### Teacher
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| userId | String | FK -> User, unique |
| licenseNumber | String | instructor license |
| vehicleDescription | String? | e.g. make/model/plate |
| defaultLessonDurationMin | Int | e.g. 45 |
| defaultLessonPrice | Decimal | shekels |
| minBookingNoticeHours | Int | booking rule |
| maxBookingHorizonDays | Int | booking rule, how far ahead students can book |
| cancellationDeadlineHours | Int | e.g. 12 |
| timezone | String | e.g. "Asia/Jerusalem", configurable, not hardcoded |
| active | Boolean | |

Schema is written so a `Student` belongs to exactly one `Teacher`, and a
`Teacher` has many `Student`s, many `Lesson`s, `TeacherAvailability` rules,
and `AvailabilityException`s — this already supports multiple teachers
existing side by side even though v1 will typically be seeded with one.

### Student
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| userId | String | FK -> User, unique |
| teacherId | String | FK -> Teacher |
| dateOfBirth | Date? | |
| address | String? | optional, minimal collection per spec |
| drivingLicenseType | String? | e.g. "B" |
| preferredLessonDurationMin | Int? | overrides teacher default if set |
| enrollmentDate | DateTime | |
| notes | String? | teacher-authored, private to teacher/admin |
| active | Boolean | |

### Lesson
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| studentId | String | FK -> Student |
| teacherId | String | FK -> Teacher |
| startTime | DateTime (UTC) | |
| endTime | DateTime (UTC) | |
| status | Enum | PENDING, ACCEPTED, DECLINED, CANCELLED_BY_STUDENT, CANCELLED_BY_TEACHER, COMPLETED, NO_SHOW |
| price | Decimal | snapshot at booking time (teacher's price may change later) |
| studentNotes | String? | student's note when requesting |
| teacherNotes | String? | private, teacher-only |
| declineReason | String? | optional, shown to student |
| createdAt / updatedAt | DateTime | |

Indexes: `(teacherId, startTime)` and `(studentId, startTime)` for fast
calendar queries. A partial unique-style guard (enforced in the booking
transaction, described below) prevents two non-cancelled/non-declined
lessons for the same teacher from overlapping in time.

### TeacherAvailability (recurring weekly)
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| teacherId | String | FK -> Teacher |
| dayOfWeek | Int (0=Sunday..6=Saturday) | matches Israeli week start |
| startTime | Time (or minutes-since-midnight Int) | local time in teacher's timezone |
| endTime | Time | |
| active | Boolean | lets a rule be toggled off without deleting history |

A teacher can have multiple rows per day (e.g. 08:00–12:00 and
16:00–20:00 on Sunday), matching the spec's example directly.

### AvailabilityException
Handles both "blocked" and "exceptionally open" one-off dates.

| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| teacherId | String | FK -> Teacher |
| date | Date | |
| type | Enum: UNAVAILABLE, AVAILABLE | |
| startTime | Time? | null = whole day, used when type=AVAILABLE or a partial-day block |
| endTime | Time? | |
| reason | String? | e.g. "חופשה", "טיפול ברכב" |

### Message
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| senderId | String | FK -> User |
| receiverId | String | FK -> User |
| message | String | |
| createdAt | DateTime | |
| readAt | DateTime? | null = unread |

v1 is direct 1:1 messaging (student <-> their teacher). `senderId`/
`receiverId` referencing `User` rather than `Student`/`Teacher` directly
is deliberate so a future group/system-message model can reuse the same
table without a migration that changes foreign key targets.

### Notification
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| userId | String | FK -> User, recipient |
| type | Enum | LESSON_REQUESTED, LESSON_ACCEPTED, LESSON_DECLINED, LESSON_CANCELLED, NEW_MESSAGE, LESSON_REMINDER |
| payload | Json | small structured data (e.g. lessonId) to build the link/text |
| readAt | DateTime? | null = unread |
| createdAt | DateTime | |

Delivery channel (in-app now; email/SMS/push later) is intentionally not a
column on this table — it's an in-app feed. A separate future
`NotificationDelivery` table (channel, status, sentAt) can be added without
touching this one, satisfying "structure so email/SMS/push can be added
later."

### Payment
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| lessonId | String? | FK -> Lesson, nullable (a payment could cover multiple lessons/a package later) |
| studentId | String | FK -> Student |
| amount | Decimal | |
| status | Enum: PENDING, PAID, REFUNDED, CANCELLED | |
| method | String? | free-text for now ("cash", "bit", "bank transfer") — no provider integration in v1 |
| paidAt | DateTime? | |
| notes | String? | |
| createdAt / updatedAt | DateTime | |

### LessonProgress (Phase 10, planned)
Recorded per completed lesson, separate from `Lesson.teacherNotes` so
progress data has clear structure for reporting to students.

| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| lessonId | String | FK -> Lesson, unique |
| topicsPracticed | String[] (or a join table `LessonTopic`) | e.g. חניה, כבישים בינעירוניים |
| areasForImprovement | String? | |
| instructorAssessment | String? | |

(Whether topics are a Postgres string array or a normalized
`Topic`/`LessonTopic` join table is a Phase 10 decision — a join table is
likely better once we want per-student progress trends across many
lessons.)

### RefreshToken (added during Phase 1 implementation)
Not in the original plan above — added so refresh tokens are revocable
server-side (logout, forced logout) rather than purely stateless, per the
decision recorded in `docs/SECURITY.md` and `PROJECT_STATUS.md`.

| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| userId | String | FK -> User |
| tokenHash | String | SHA-256 hash of the token, unique — the raw token is never stored |
| expiresAt | DateTime | |
| revokedAt | DateTime? | null = still valid |
| createdAt | DateTime | |

Refresh tokens rotate on every use (old one revoked, new one issued),
implemented in `backend/src/services/authService.ts`.

## Relationships summary

```
User 1───1 Teacher 1───* Student
User 1───1 Student
Teacher 1───* Lesson *───1 Student
Teacher 1───* TeacherAvailability
Teacher 1───* AvailabilityException
User 1───* Message (as sender)
User 1───* Message (as receiver)
User 1───* Notification
Student 1───* Payment
Lesson 1───0..1 Payment (or many, if packages are introduced later)
Lesson 1───0..1 LessonProgress
```

## Booking concurrency (double-booking prevention)

Planned approach for Phase 1/3:
1. Compute candidate availability server-side (recurring availability +
   exceptions − existing non-cancelled lessons).
2. On booking submission, run the insert inside a Postgres transaction that
   re-checks for overlapping `Lesson` rows for that teacher with status in
   (PENDING, ACCEPTED) using `SELECT ... FOR UPDATE` on the affected range,
   then inserts.
3. As a hard backstop against races even under transaction misuse, add an
   exclusion constraint or a unique index strategy (e.g. Postgres `EXCLUDE
   USING gist` on `(teacherId, tstzrange(startTime, endTime))` for
   non-cancelled statuses) so the database itself rejects overlaps even if
   application logic has a bug. Exact implementation finalized when Prisma
   migrations are written, since Prisma needs a raw SQL migration for
   exclusion constraints.

## Migrations

Prisma migrations will be checked into `backend/prisma/migrations`. No
manual schema edits against a running database — every change goes through
`prisma migrate dev` (development) / `prisma migrate deploy` (production).
