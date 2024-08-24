import React, { Suspense } from "react";
import { SignInForm } from "./_components/signin-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  OAuthSigninButtonsSkeleton,
  OauthSigninButton} from "@/components/oauth-signin-button";
import ForgotPasswordForm from "./_components/forgot-password-form";

const SignInPage = () => {
  return (
    <main className="mt-4">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>

        {/* SignIn Form */}
        <div className="h-1 bg-muted my-4" />
        <SignInForm />
        {/* OAuth Links */}
        <div className="h-1 bg-muted my-4" />
        <Suspense fallback={<OAuthSigninButtonsSkeleton />}>

        <OauthSigninButton />
        </Suspense>

        {/* Go to Signin Link */}
        <div className="my-4 h-1 bg-muted" />

        <p>
          Don&apos;t have an account? Click{" "}
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link href="/auth/signup">here</Link>
          </Button>{" "}
          to sign up
        </p>

        {/**Forgot password dialog */}
        <ForgotPasswordForm />
      </div>
    </main>
  );
};

export default SignInPage;
