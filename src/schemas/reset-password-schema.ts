import z from "zod";

export const resetPasswordSchema = z.object({
  email: z.email(),
});

export interface ResetPasswordSchema extends z.infer<typeof resetPasswordSchema> {};