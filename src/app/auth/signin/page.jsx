// src/app/auth/signin/page.jsx

"use client";

import React, { Suspense } from "react";
import { OauthSigninButton } from "@/components/oauth-signin-button";

const SignInPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      {/* Content Container */}
      <div className="w-full max-w-md px-8 py-10 bg-white shadow-lg rounded-lg mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/ewu-logo.svg" alt="EWU Logo" className="h-20 w-auto" />
        </div>

        {/* Application Name */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold text-[#1C4370]">
            Course Archiver
          </h2>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {/* OAuth Sign-In Buttons Wrapped in Suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <OauthSigninButton />
        </Suspense>
      </div>
    </main>
  );
};

export default SignInPage;
