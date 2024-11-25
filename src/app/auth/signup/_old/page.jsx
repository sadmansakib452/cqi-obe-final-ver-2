import React, { Suspense } from "react";
import { SignUpForm } from "./_components/signup-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  OAuthSigninButtonsSkeleton,
  OauthSigninButton,
} from "@/components/oauth-signin-button";
import { ArrowLeft } from "lucide-react"; // Importing an arrow icon

const SignUpPage = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Branding */}
        <div className="text-center mb-4">
          <h2 className="text-sm font-light text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            EWU - Course File Archiver
          </h2>
        </div>

        {/* Centered Sign Up Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold dark:text-white">Sign Up</h1>
        </div>

        {/* Signup Form */}
        <div className="h-1 bg-muted dark:bg-gray-700 my-4" />
        <SignUpForm />

        {/* OAuth Links */}
        <div className="h-1 bg-muted dark:bg-gray-700 my-4" />
        <Suspense fallback={<OAuthSigninButtonsSkeleton signup />}>
          <OauthSigninButton signup />
        </Suspense>

        {/* Go to Signin Link */}
        <div className="my-4 h-1 bg-muted dark:bg-gray-700" />
        <p className="text-center dark:text-gray-300">
          Already have an account? Click{" "}
          <Button
            variant="link"
            size="sm"
            className="px-0 dark:text-blue-400"
            asChild
          >
            <Link href="/auth/signin">here</Link>
          </Button>{" "}
          to sign in
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;
