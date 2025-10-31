"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateUserWithEmailAndPassword, useSendEmailVerification, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { auth } from "@/app/firebase/config";
import { parseFirebaseError } from "@/lib/firebase-utils";
import { signUpSchema, SignUpSchema } from "@/schemas/sign-up-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter()
  const [createUserWithEmailAndPassword, user, loadingCreate, errorCreate] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification, sending, errorEmail] = useSendEmailVerification(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpSchema) => {
    try {
      const res = await createUserWithEmailAndPassword(data.email, data.password);
      if (res?.user && await sendEmailVerification()) {
        router.push("sign-in?mode=verifyEmail");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const onSignInWithGoogle = async () => {
    try {
      const res = await signInWithGoogle();
      if (res?.user) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-30 p-8 border-2 rounded-3xl shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Sign Up</h1>
      <div className="flex flex-col gap-6 items-center">
        {(errorCreate || errorEmail) && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to create account</AlertTitle>
            <AlertDescription>
              {parseFirebaseError(errorCreate || errorEmail)}
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form className="w-full flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-3 flex flex-col justify-center items-center gap-2">
              <Button type="submit" className="w-50 self-center" disabled={loadingCreate}>Sign Up</Button>
              <Link href="sign-in" className="w-auto text-xs">Already have an account? <span className="text-blue-500">Sign In</span></Link>
            </div>
          </form>
        </Form>
        <Separator className="w-full" />
        <Button variant="outline" className="w-50" onClick={onSignInWithGoogle}>Continue with Google</Button>
      </div>
    </div>
  );
}