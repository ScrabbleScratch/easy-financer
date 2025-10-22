"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { auth } from "@/app/firebase/config";
import { resetPasswordSchema, ResetPasswordSchema } from "@/schemas/reset-password-schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [sendPasswordResetEmail] = useSendPasswordResetEmail(auth);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const res = await sendPasswordResetEmail(data.email);
      setEmailSent(res);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      const message = error instanceof Error ? error.message : String(error);
      toast("Error sending password reset email", {
        description: message,
      });
    }
  };

  const onReturn = () => {
    router.push("sign-in");
  };

  return (
    <div className="max-w-md mx-auto my-30 p-8 border-2 rounded-3xl shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Reset Password</h1>
      {emailSent ? (
        <div className="w-full flex flex-col gap-5">
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Password reset email sent successfully!</AlertTitle>
            <AlertDescription>Please check your inbox for the reset link.</AlertDescription>
          </Alert>
          <Button className="w-full" onClick={onReturn}>Return To Sign In</Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col justify-center items-center gap-2">
              <Button type="submit" className="w-full">Send Reset Password Email</Button>
              <Link href="sign-in" className="w-auto text-xs">Did you remember your password? <span className="text-blue-500">Sign In</span></Link>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}