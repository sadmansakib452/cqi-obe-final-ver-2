import React, { Suspense } from "react";
import { SignInForm } from "./_components/signin-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  OAuthSigninButtonsSkeleton,
  OauthSigninButton,
} from "@/components/oauth-signin-button";
import ForgotPasswordForm from "./_components/forgot-password-form";
import { ArrowLeft } from "lucide-react"; // Importing an arrow icon

const SignInPage = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Branding */}
        <div className="text-center mb-4">
          <h2 className="text-sm font-light text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            EWU - Course File Archiver
          </h2>
        </div>

        {/* Centered Sign In Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold dark:text-white">Sign In</h1>
        </div>

        {/* SignIn Form */}
        <div className="h-1 bg-muted dark:bg-gray-700 my-4" />
        <SignInForm />

        {/* OAuth Links */}
        <div className="h-1 bg-muted dark:bg-gray-700 my-4" />
        <Suspense fallback={<OAuthSigninButtonsSkeleton />}>
          <OauthSigninButton />
        </Suspense>

        {/* Go to Signup Link */}
        <div className="my-4 h-1 bg-muted dark:bg-gray-700" />
        <p className="text-center dark:text-gray-300">
          Don&apos;t have an account? Click{" "}
          <Button
            variant="link"
            size="sm"
            className="px-0 dark:text-blue-400"
            asChild
          >
            <Link href="/auth/signup">here</Link>
          </Button>{" "}
          to sign up
        </p>

        <p className="text-center dark:text-gray-300">
          {/* Forgot Password Dialog */}
          <ForgotPasswordForm />
        </p>
      </div>
    </main>
  );
};

export default SignInPage;
