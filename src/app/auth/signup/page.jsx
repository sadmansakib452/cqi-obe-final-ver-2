import React, { Suspense } from "react";
import { SignUpForm } from "./_components/signup-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  OAuthSigninButtonsSkeleton,
  OauthSigninButton,
} from "@/components/oauth-signin-button";

const SignUpPage = () => {
  return (
    <main className="mt-4">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight">Sign Up</h1>

        {/* Signup Form */}
        <div className="h-1 bg-muted my-4" />
        <SignUpForm />

        {/* OAuth Links */}
        <div className="h-1 bg-muted my-4" />
        <Suspense fallback={<OAuthSigninButtonsSkeleton signup />}>
          <OauthSigninButton signup />
        </Suspense>

        {/* Go to Signin Link */}
        <div className="my-4 h-1 bg-muted" />

        <p>
          Already have an account? Click{" "}
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link href="/auth/signin">here</Link>
          </Button>{" "}
          to sign in
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;
