import z from "zod";

export const signInSchema = z
  .object({
    email: z.email(),
    password: z.string().nonempty("Password is required"),
  });

export interface SignInSchema extends z.infer<typeof signInSchema> {};