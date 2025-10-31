import z from "zod";

export const signInSchema = z
  .object({
    email: z.email(),
    password: z.string().nonempty("Password is required"),
  });

export type SignInSchema = z.infer<typeof signInSchema>;