import z from "zod";

export const resetPasswordSchema = z.object({
  email: z.email(),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;