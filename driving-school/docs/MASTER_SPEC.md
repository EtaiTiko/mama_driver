# Master Development Spec (original, verbatim)

This is the original project brief in full, kept as the canonical
reference for every phase. `ARCHITECTURE.md`, `DATABASE.md`,
`FEATURES.md`, and `SECURITY.md` are working documents *derived* from
this spec — if anything in them ever seems to conflict with this file,
this file wins. Exact Hebrew UI strings, phase-by-phase feature detail,
and specific policy wording should be pulled from here, not reconstructed
from memory.

---

# Driving School Management Platform — Master Development Prompt

You are the lead full-stack developer responsible for building a production-ready web application for a driving instructor and his students.

The application must be written primarily in **Hebrew** and optimized for **mobile phones first**. Desktop support is still required, but mobile is the primary platform.

The application allows a driving instructor to manage students, availability, driving lessons, cancellations, communication, payments and student progress. Students can log in, see available lesson times, request lessons, communicate with the instructor and track their lessons.

Build the project incrementally according to the phases below.

IMPORTANT:

1. Do not attempt to build the entire application in one step.
2. Complete one phase at a time.
3. At the end of every phase, update `/PROJECT_STATUS.md`.
4. `/PROJECT_STATUS.md` must contain:

   * What has been completed
   * What is currently being worked on
   * What remains
   * Database changes
   * API endpoints created
   * Important technical decisions
   * Known bugs
   * Next recommended action
5. If you run out of context or tokens, the next session must read `/PROJECT_STATUS.md` and continue from exactly where the previous session stopped.
6. Never rewrite working functionality unnecessarily.
7. Before making major architectural changes, explain the reason and update the documentation.
8. Use clean, modular, maintainable code.
9. All user-facing text must be Hebrew.
10. The UI must use RTL.
11. Code, variable names, database field names and comments should be in English.
12. Do not use fake data once the relevant database functionality has been implemented.
13. Security is important. Never store plaintext passwords.
14. The application must work well on small mobile screens.

---

# PHASE 0 — PROJECT PLANNING

Before writing substantial code, inspect the existing project.

If the project is empty, establish the application architecture.

Create:

`/PROJECT_STATUS.md`

`/README.md`

`/docs/ARCHITECTURE.md`

`/docs/DATABASE.md`

`/docs/FEATURES.md`

`/docs/SECURITY.md`

Determine an appropriate technology stack.

Preferred stack unless there is a strong reason to use something else:

Frontend:

* React
* TypeScript
* Vite or Next.js
* Tailwind CSS
* RTL support
* Mobile-first responsive design

Backend:

* Node.js
* TypeScript
* Express or Next.js API routes

Database:

* PostgreSQL

ORM:

* Prisma

Authentication:

* Secure session or JWT based authentication
* Passwords hashed with Argon2 or bcrypt
* Never store plaintext passwords

The architecture should make it possible to deploy the frontend, backend and database independently if necessary.

At the end of this phase, document the architecture before proceeding.

---

# PHASE 1 — DATABASE AND AUTHENTICATION

Create the complete database foundation.

There should be at least these entities:

## Users

A user represents someone who can log into the system.

Fields should include appropriate fields such as:

* id
* firstName
* lastName
* phone
* email
* passwordHash
* role
* createdAt
* updatedAt
* active

Roles:

* TEACHER
* STUDENT
* ADMIN

Do not store passwords directly.

## Teacher

Store instructor-specific information.

Potential fields:

* id
* userId
* licenseNumber
* vehicle information
* lesson duration
* default lesson price
* active

The architecture should allow multiple teachers in the future even if the first version primarily supports one instructor.

## Student

Store student-specific information.

Potential information:

* id
* userId
* teacherId
* dateOfBirth
* address
* notes
* enrollmentDate
* active
* drivingLicenseType
* preferredLessonDuration

Do not unnecessarily collect sensitive information.

## Lessons

A lesson should contain:

* id
* studentId
* teacherId
* startTime
* endTime
* status
* price
* studentNotes
* teacherNotes
* createdAt
* updatedAt

Lesson statuses should include something similar to:

* PENDING
* ACCEPTED
* DECLINED
* CANCELLED_BY_STUDENT
* CANCELLED_BY_TEACHER
* COMPLETED
* NO_SHOW

## Teacher Availability

Allow the teacher to define when they are generally available.

Examples:

Sunday:
08:00–12:00
16:00–20:00

Monday:
09:00–18:00

etc.

Support:

* recurring weekly availability
* specific unavailable dates
* vacations
* holidays
* one-time availability overrides

## Availability Exceptions

Examples:

* Teacher unavailable on 2026-09-10
* Teacher available exceptionally on 2026-09-12 09:00–13:00

## Messages

Create a basic messaging system.

Fields:

* id
* senderId
* receiverId
* message
* createdAt
* readAt

Initially support direct communication between teacher and student.

The architecture should allow group/system messages later.

## Notifications

Create a notification entity.

Examples:

* New lesson request
* Lesson accepted
* Lesson declined
* Lesson cancelled
* New message
* Upcoming lesson reminder

## Payments

Create the database structure for payments, even if full payment processing is not implemented initially.

Possible statuses:

* PENDING
* PAID
* REFUNDED
* CANCELLED

Do not integrate a payment provider yet unless specifically requested.

---

# AUTHENTICATION

Implement:

* Login
* Logout
* Password hashing
* Authentication persistence
* Role-based authorization
* Protected routes
* Student access
* Teacher access
* Admin access

Students must only be able to access their own information.

Teachers must only be able to access their students and lessons.

Admins may access the entire system.

Create appropriate validation.

For example:

* Invalid password
* User does not exist
* Inactive user
* Invalid session
* Unauthorized resource access

Create a proper initial teacher/admin account creation mechanism.

Do NOT hardcode a production password into the source code.

Use environment variables or a secure initialization process.

---

# PHASE 2 — MOBILE UI FOUNDATION

Build the visual system.

The entire application must be:

* Hebrew
* RTL
* Mobile-first
* Touch friendly
* Fast
* Simple

The design should feel like a modern Israeli service rather than an enterprise dashboard.

Prioritize:

* large buttons
* clear typography
* obvious actions
* cards
* simple navigation
* minimal typing
* good spacing
* readable calendar

Avoid:

* unnecessary animations
* overly complicated dashboards
* tiny buttons
* desktop-first layouts

Create:

## Mobile navigation

Student navigation:

* דף הבית
* שיעורים
* זמינות
* הודעות
* פרופיל

Teacher navigation:

* דף הבית
* לוח שיעורים
* תלמידים
* זמינות
* הודעות
* הגדרות

Use icons with Hebrew labels.

---

# PHASE 3 — STUDENT EXPERIENCE

Create the student application.

## Student dashboard

Show:

* next driving lesson
* lesson date
* lesson time
* lesson status
* instructor name
* quick button to request a lesson
* unread messages
* relevant notifications

Example:

"השיעור הבא שלך"

יום שני, 14 בספטמבר
16:00–17:00

סטטוס: מאושר

---

# LESSON BOOKING

Students should be able to request a lesson.

Flow:

1. Student selects date.
2. System displays available times.
3. Student selects time.
4. Student sees lesson duration and price.
5. Student submits request.
6. Lesson receives PENDING status.
7. Teacher receives notification.
8. Student sees "ממתין לאישור".

IMPORTANT:

The system must prevent double booking.

Availability must be calculated from:

* teacher recurring availability
* exceptions
* existing lessons
* lesson duration
* booking rules

---

# AVAILABLE TIME SLOTS

Create a clean mobile scheduling interface.

Example:

יום שלישי, 15 בספטמבר

09:00
10:00
11:00
14:00
15:00
17:00

Available slots should be visually distinct.

Unavailable times should not be selectable.

Consider allowing the teacher to configure:

* minimum notice before booking
* maximum days ahead
* lesson duration
* cancellation deadline

---

# LESSON CANCELLATION

Students can cancel lessons according to the teacher's configured cancellation policy.

For example:

"ניתן לבטל שיעור עד 12 שעות לפני תחילתו."

The system should prevent cancellation when appropriate.

Teacher cancellation should also be supported.

---

# PHASE 4 — TEACHER DASHBOARD

Create a powerful but simple teacher dashboard.

The teacher should immediately see:

* today's lessons
* pending requests
* upcoming lessons
* cancellations
* unread messages
* student count

Example:

היום

09:00 — דניאל כהן
10:00 — יובל לוי
12:00 — נועה ישראלי

בקשות חדשות

14:00 — אורי כהן
[אישור] [דחייה]

---

# LESSON REQUEST MANAGEMENT

Teacher can:

* accept
* decline
* cancel
* mark completed
* mark no-show
* add notes

When declining a lesson, allow an optional reason.

For example:

"אני לא זמין בשעה הזו"

The student should receive a notification.

---

# PHASE 5 — CALENDAR

Create a proper calendar.

Teacher:

* day view
* week view
* optionally month view

Student:

* primarily week/date selection
* available lesson slots

The teacher calendar should clearly distinguish:

* accepted lessons
* pending requests
* unavailable periods
* completed lessons
* cancelled lessons

Mobile UI should prioritize day and week views.

---

# PHASE 6 — TEACHER AVAILABILITY MANAGEMENT

Teacher can define:

## Weekly schedule

Example:

Sunday:
08:00–13:00
15:00–20:00

Monday:
08:00–18:00

Tuesday:
08:00–18:00

etc.

## Specific unavailable dates

Examples:

חופשה
מבחן
יום חופשי
טיפול ברכב

## Specific available dates

Allow the teacher to add availability outside the normal schedule.

---

# PHASE 7 — STUDENT MANAGEMENT

Create a teacher-facing student list.

Each student should have a profile.

Display:

* name
* phone
* number of lessons
* upcoming lesson
* completed lessons
* cancelled lessons
* payment status
* notes

Student profile:

## פרטי תלמיד

שם
טלפון
אימייל
סוג רישיון
תאריך הצטרפות

## שיעורים

Upcoming
Completed
Cancelled

## הערות

Teacher notes.

---

# PHASE 8 — COMMUNICATION

Create a simple messaging system.

Student can send a message to teacher.

Teacher can reply.

Create a chat interface optimized for mobile.

Features:

* unread messages
* timestamps
* read status
* automatic scrolling to newest message

Potential future feature:

WhatsApp integration.

Do not implement WhatsApp integration yet.

---

# PHASE 9 — NOTIFICATIONS

Implement in-app notifications.

Examples:

Student:

"שיעור הנהיגה שלך אושר"

"שיעור הנהיגה שלך נדחה"

"יש לך שיעור מחר בשעה 16:00"

Teacher:

"נועה ביקשה שיעור ביום שלישי בשעה 17:00"

"תלמיד ביטל שיעור"

Implement notification read/unread state.

If practical, create the backend structure so email/SMS/push notifications can be added later.

---

# PHASE 10 — LESSON HISTORY AND PROGRESS

Allow the teacher to record information after every lesson.

For each completed lesson:

* lesson date
* duration
* teacher notes
* student progress
* topics practiced
* areas requiring improvement

Possible categories:

* שליטה ברכב
* חניה
* השתלבות בתנועה
* צמתים
* כבישים בינעירוניים
* נהיגה בעיר
* כביש מהיר
* עקיפות
* רוורס
* חניה במקביל
* חניה בניצב
* התמודדות עם מצבי לחץ

Allow the teacher to mark progress.

Students can see appropriate progress information.

---

# PHASE 11 — PAYMENTS

Build payment tracking.

Teacher should be able to see:

* unpaid lessons
* paid lessons
* total owed
* total paid

Student should be able to see:

* outstanding balance
* payment history

Initially this can be manual.

Do not integrate Stripe, PayPal or Israeli payment providers unless explicitly requested.

---

# PHASE 12 — ADMINISTRATION

Create an admin area.

Admin can:

* create teachers
* create students
* deactivate accounts
* reset passwords
* view system statistics
* manage system settings

The architecture should support multiple driving instructors.

---

# PHASE 13 — SECURITY

Perform a security review.

Check:

* password hashing
* authentication
* authorization
* session handling
* CSRF where relevant
* XSS
* SQL injection
* input validation
* rate limiting
* brute-force protection
* secure cookies
* environment variables
* sensitive information exposure
* API authorization

A student must never be able to request another student's data by changing an ID in the URL or API request.

A teacher must only access their own students.

---

# PHASE 14 — UX POLISH

Test the application specifically on:

* iPhone-sized screens
* Android-sized screens
* tablets
* desktop

Pay special attention to Hebrew RTL behavior.

Test:

* calendar
* date picker
* forms
* navigation
* buttons
* chat
* lesson booking
* teacher approval

Make the primary flows require as few clicks as reasonably possible.

The most important student flow should be:

Login → See available times → Select time → Request lesson

The most important teacher flow should be:

Login → See pending request → Accept/decline

---

# PHASE 15 — TESTING

Create automated tests where appropriate.

At minimum test:

Authentication:

* successful login
* failed login
* unauthorized access

Scheduling:

* available slot
* unavailable slot
* conflicting lesson
* double booking prevention
* cancellation

Authorization:

* student cannot access another student
* student cannot access teacher dashboard
* teacher cannot access another teacher's students

Database:

* lesson relationships
* student relationships
* availability

Also manually test the complete application.

---

# PHASE 16 — DEPLOYMENT

Prepare the application for deployment.

Create:

`.env.example`

Document required environment variables.

Document:

* database setup
* migrations
* seed process
* development
* production build
* deployment
* admin account creation

Do not commit secrets.

---

# IMPORTANT PRODUCT REQUIREMENTS

The application must feel extremely simple.

The student should not need technical knowledge.

A student should be able to open the site on their phone and understand what to do immediately.

The teacher dashboard can be more sophisticated.

The design should prioritize:

1. Scheduling
2. Availability
3. Lesson requests
4. Communication
5. Student management
6. Lesson history
7. Payments

---

# IMPORTANT SCHEDULING RULES

Build the scheduling engine carefully.

A slot is available only when:

Teacher is normally available
AND
there is no availability exception blocking it
AND
there is no existing lesson overlapping it
AND
the requested lesson duration fits
AND
the requested time satisfies booking rules.

Prevent race conditions that could allow two students to book the same time.

The backend must be the authority on availability.

Never trust the frontend to determine whether a slot is actually available.

---

# DATABASE DESIGN REQUIREMENTS

Use foreign keys and proper indexes.

Use transactions for operations where consistency matters.

Use UTC internally where appropriate and convert to the application's configured timezone for display.

The system should support timezone configuration rather than hardcoding assumptions into business logic.

---

# DEVELOPMENT WORKFLOW

At the beginning of every session:

1. Read `/PROJECT_STATUS.md`
2. Read relevant documentation
3. Inspect the current code
4. Determine exactly what remains
5. Continue from the last unfinished task

At the end of every session:

1. Run tests
2. Check for TypeScript/build errors
3. Update `/PROJECT_STATUS.md`
4. Record unfinished work
5. Record database changes
6. Record next steps

Never claim something is finished if it has not actually been implemented and tested.

---

# DEFINITION OF DONE

The application is considered complete only when:

* Users can register or be created
* Users can log in securely
* Students and teachers have different permissions
* Teacher can define availability
* Students can see available lesson times
* Students can request lessons
* Teacher can accept/decline lessons
* Conflicting bookings are prevented
* Students can cancel lessons according to policy
* Teachers can cancel lessons
* Both sides can communicate
* Notifications work
* Teacher can manage students
* Lesson history works
* Basic payment tracking works
* The application is fully RTL
* The application works well on mobile
* Database migrations work
* Production build succeeds
* Security checks have been performed
* Documentation is complete
