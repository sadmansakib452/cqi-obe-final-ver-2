"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignoutButton } from "@/components/signout-button";
import { useSession } from "next-auth/react";
import { Loader2Icon } from "lucide-react";

export const AuthButtons = () => {
  const session = useSession();

  switch (session.status) {
    case "loading":
      return <Loading />;
    case "unauthenticated":
      return <SignedOut />;
    case "authenticated":
      return <SignedIn />;
    default:
      return null;
  }
};

const Loading = () => {
  return (
    <Button size="sm" variant="ghost" className="mr-2">
      <Loader2Icon className="min-w-[8ch] animate-spin" />
    </Button>
  );
};

const SignedIn = () => {
  return (
    <div className="flex space-x-2">
      <Button size="sm" asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>

      <SignoutButton />
    </div>
  );
};

const SignedOut = () => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>

      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
};
