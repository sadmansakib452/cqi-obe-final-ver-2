"use client";
export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import AuthErrorPage from "./AuthErrorPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorPage />
    </Suspense>
  );
}
