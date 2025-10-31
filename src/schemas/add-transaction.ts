import z from "zod";

export const addTransactionSchema = z.object({
  type: z
    .enum(["DEPOSIT", "WITHDRAWAL"])
    .nonoptional("Type is required")
    .readonly(),
  amount: z
    .coerce
    .number<number>()
    .gt(0, "Can't be zero or less"),
  concept: z
    .string()
    .trim()
    .normalize()
    .transform(val => val === "" ? null : val)
    .nullable(),
  date: z
    .date()
    .nonoptional("Transaction date is required"),
});

export type AddTransactionSchema = z.infer<typeof addTransactionSchema>;