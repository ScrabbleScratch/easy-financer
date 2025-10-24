"use client";

import { redirect } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/app/firebase/config";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, loading, error] = useAuthState(auth);

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
  if (!user || error) {
    redirect("/sign-in");
  }
  if (user) {
    return children;
  }
}
