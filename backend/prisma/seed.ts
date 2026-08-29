import crypto from "node:crypto";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/password.js";

// Creates the very first ADMIN account so someone can log in at all.
// Safe to re-run: does nothing if that phone number already exists.
//
// Credentials come from INITIAL_ADMIN_PHONE / INITIAL_ADMIN_PASSWORD
// environment variables (see .env.example). If INITIAL_ADMIN_PASSWORD is
// left blank, a random password is generated and printed ONCE to the
// console here — it is never stored or logged anywhere else, only its
// hash is persisted to the database.
async function main() {
  const phone = process.env.INITIAL_ADMIN_PHONE?.trim();
  if (!phone) {
    throw new Error("INITIAL_ADMIN_PHONE is not set. Add it to your .env before seeding.");
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    console.log(`Seed: a user with phone ${phone} already exists — skipping.`);
    return;
  }

  const providedPassword = process.env.INITIAL_ADMIN_PASSWORD?.trim();
  const password = providedPassword || crypto.randomBytes(12).toString("base64url");
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      firstName: "מנהל",
      lastName: "מערכת",
      phone,
      passwordHash,
      role: "ADMIN",
      active: true,
    },
  });

  console.log("Seed: created initial admin user.");
  console.log(`  phone:  ${phone}`);
  if (!providedPassword) {
    console.log(`  password (shown once, not stored anywhere in plaintext): ${password}`);
  }
  console.log(`  userId: ${user.id}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
