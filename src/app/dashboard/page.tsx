"use client";

import { useSignOut } from "react-firebase-hooks/auth";

import { auth } from "../firebase/config";
import { Button } from "@/components/ui/button";

export default function DashboardHomePage() {
  const [signOut] = useSignOut(auth);

  return (
    <div>
      <div>Welcome to your dashboard!</div>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}