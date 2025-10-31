"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [authState, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;

    if (authState) {
      router.replace("/dashboard");
    }
  }, [authState, loading, error, router])

  return (
    <>
      <nav className="h-15 p-2 flex flex-row">
        <div className="w-full relative">
          <Link href="/">
            <Image src="/easy-financer.svg" alt="Easy Financer logo" fill />
          </Link>
        </div>
      </nav>
      <div className="p-6">
        {children}
      </div>
    </>
  );
}
