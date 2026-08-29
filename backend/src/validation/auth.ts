import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(9, "מספר טלפון לא תקין"),
  password: z.string().min(1, "יש להזין סיסמה"),
});

export type LoginInput = z.infer<typeof loginSchema>;
