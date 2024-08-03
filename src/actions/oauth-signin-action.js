"use server";

import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export const oauthSigninAction = async (provider) => {
  try {
    await signIn(provider, { redirectTo: "/profile" });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
  }
};
