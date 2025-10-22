"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { auth } from "@/app/firebase/config";
import { signInSchema, SignInSchema } from "@/schemas/sign-in-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  const router = useRouter();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
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
      const res = await signInWithEmailAndPassword(data.email, data.password);
      if (res?.user) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const onSignInWithGoogle = async () => {
    try {
      const res = await signInWithGoogle();
      if (res?.user) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-30 p-8 border-2 rounded-3xl shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Sign In</h1>
      <div className="flex flex-col gap-6 items-center">
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
            <div className="mt-3 flex flex-col justify-center items-center gap-6">
              <div className="mt-3 flex flex-col justify-center items-center gap-2">
                <Button type="submit" className="w-50 self-center">Sign In</Button>
                <Link href="reset-password" className="w-auto text-xs">Forgot password?</Link>
              </div>
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