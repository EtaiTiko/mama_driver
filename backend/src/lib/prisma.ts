import { PrismaClient } from "@prisma/client";

// A single shared Prisma client per process. Guarding via globalThis
// avoids accidentally creating a new client (and new DB connection
// pool) on every hot-reload during development.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
