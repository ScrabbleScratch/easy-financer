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
});

export interface AddTransactionSchema extends z.infer<typeof addTransactionSchema> {};