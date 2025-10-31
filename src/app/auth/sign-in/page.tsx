"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { auth } from "@/app/firebase/config";
import { parseFirebaseError } from "@/lib/firebase-utils";
import { signInSchema, SignInSchema } from "@/schemas/sign-in-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

enum AlertMode {
  VERIFY = "verifyEmail",
  CREATE_ERROR = "createError",
  LOGIN_ERROR = "loginError",
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [alertMode, setAlertMode] = useState(searchParams.get("mode"))
  const [signInWithEmailAndPassword, user, loading, errorLogin] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    try {
      setAlertMode(null);
      const res = await signInWithEmailAndPassword(data.email, data.password);
      if (res?.user) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const onSignInWithGoogle = async () => {
    try {
      setAlertMode(null);
      const res = await signInWithGoogle();
      if (res?.user) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const getModeAlert = () => {
    switch (alertMode) {
      case AlertMode.VERIFY:
        return (
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Verify your account</AlertTitle>
            <AlertDescription>
              A verification link was sent to your email
            </AlertDescription>
          </Alert>
        );
      case AlertMode.CREATE_ERROR:
        return (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to sign in</AlertTitle>
            <AlertDescription>
              Couldn't sign in to your account. Try again or contact support if the problem persist
            </AlertDescription>
          </Alert>
        );
      case AlertMode.LOGIN_ERROR:
        return (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to sign in</AlertTitle>
            <AlertDescription>
              {parseFirebaseError(errorLogin)}
            </AlertDescription>
          </Alert>
        )
      default:
        return <></>;
    }
  }

  useEffect(() => {
    if (errorLogin) {
      setAlertMode(AlertMode.LOGIN_ERROR);
    }
  }, [errorLogin])

  return (
    <div className="max-w-md mx-auto my-30 p-8 border-2 rounded-3xl shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Sign In</h1>
      <div className="flex flex-col gap-6 items-center">
        {getModeAlert()}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link href="reset-password" className="w-auto text-xs">Forgot password?</Link>
            <div className="mt-3 flex flex-col justify-center items-center gap-2">
              <Button type="submit" className="w-50 self-center">Sign In</Button>
              <Link href="sign-up" className="w-auto text-xs">Don't have an account? <span className="text-blue-500">Sign Up</span></Link>
            </div>
          </form>
        </Form>
        <Separator className="w-full" />
        <Button variant="outline" className="w-50" onClick={onSignInWithGoogle}>Continue with Google</Button>
      </div>
    </div>
  );
}