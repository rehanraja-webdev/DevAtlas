import { z } from "zod";

//check for fullname, email and password whether they are in correct form and following the rules properly
export const registerSchema = z.object({
  body: z.object({
    fullname: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50),

    email: z.string().trim().email("Invalid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
  }),

  params: z.object({}),

  query: z.object({}),
});
