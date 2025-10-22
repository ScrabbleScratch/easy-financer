"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { auth } from "@/app/firebase/config";
import { signUpSchema, SignUpSchema } from "@/schemas/sign-up-schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  const router = useRouter()
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
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
      if (res?.user) {
        router.push("sign-in");
      }
    } catch (error) {
      console.error("Error signing up:", error);
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
      <h1 className="mb-6 text-center text-3xl font-bold">Sign Up</h1>
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
              <Button type="submit" className="w-50 self-center">Sign Up</Button>
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