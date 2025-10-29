"use client";

import { useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userState } from "@/atoms/user-state";

import { addTransactionSchema, AddTransactionSchema } from "@/schemas/add-transaction";
import { createTransaction } from "@/lib/actions/transaction-actions";
import { TransactionType } from "@/generated/prisma";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function AddTransactionPage() {
  const router = useRouter();
  const user = useAtomValue(userState);

  const form = useForm<AddTransactionSchema>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      type: "DEPOSIT",
      amount: 0,
      concept: "",
    },
  });

  const onSubmit = async (data: AddTransactionSchema) => {
    if (!user.isAuthenticated) return;

    console.log("Form data:", data);
    const res = await createTransaction(user.id, data.type as TransactionType, data.amount, data.concept);
    if (res) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-20 p-8 border-2 rounded-3xl shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Add Transaction</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEPOSIT">Deposit</SelectItem>
                      <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="concept"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concept</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
}