import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be a long random value"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be a long random value"),
  JWT_ACCESS_TOKEN_TTL: z.string().default("15m"),
  JWT_REFRESH_TOKEN_TTL: z.string().default("30d"),
  APP_TIMEZONE: z.string().default("Asia/Jerusalem"),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),
  INITIAL_ADMIN_PHONE: z.string().optional(),
  INITIAL_ADMIN_PASSWORD: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validated once at process startup. Fails fast and loudly instead of
// letting a missing secret surface later as a confusing runtime bug
// (e.g. a JWT silently signed with `undefined`).
export const env: Env = envSchema.parse(process.env);
