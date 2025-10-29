"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthState, useSendEmailVerification, useSignOut } from "react-firebase-hooks/auth";

import { auth } from "@/app/firebase/config";
import { createUser, getUser } from "@/lib/actions/auth-actions";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const [signOut] = useSignOut(auth);

  const validateUser = async (shouldRedirect?: boolean) => {
    if (!user) return;

    // Sign out and redirect if email is not verified
    if ((!user.email || !user.emailVerified)) {
      await sendEmailVerification();
      await signOut();
      return router.replace("/auth/sign-in?mode=verifyEmail");
    }

    // Validate user existance in db
    const exists = await getUser(user.email);
    if (exists) {
      setAllowed(true);
      return;
    }
    
    if (shouldRedirect) {
      await signOut();
      router.replace("/auth/sign-in?mode=createError")
      return;
    }
    
    // Create user in db
    await createUser(user.email);

    // Retry user validation
    await validateUser(true);
  }

  useEffect(() => {
    if (loading) return;

    if (!user?.email || error) {
      setAllowed(false);
      router.replace("/auth/sign-in");
    } else {
      validateUser();
    }
  }, [user, loading, error])

  if (loading) {
    return (
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Validating account</EmptyTitle>
          <EmptyDescription>
            Please wait while your account is validated.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  if (user && !allowed) {
    return (
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Finishing setup</EmptyTitle>
          <EmptyDescription>Just a moment while we verify your account.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  if (user && allowed) {
    return (
      <>
        <nav className="h-15 p-2 flex flex-row justify-between items-center shadow-md">
          <div className="h-full aspect-square relative">
            <Link href="/dashboard">
              <Image src="/easy-financer-icon.svg" alt="Easy Financer logo" fill />
            </Link>
          </div>
          <Button onClick={signOut}>
            <LogOutIcon />
            Sign Out
          </Button>
        </nav>
        {children}
      </>
    );
  }
}
