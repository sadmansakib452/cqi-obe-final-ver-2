"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const signinUserAction = async (values) => {
  try {
    if (
      typeof values !== "object" ||
      values === null ||
      Array.isArray(values)
    ) {
      throw new Error("Invalid JSON Object");
    }
    await signIn("credentials", { ...values, redirect: false });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return {
            success: false,
            error: "Invalid credentials",
            statusCode: 401,
          };
        case "AccessDenied":
          return {
            success: false,
            error:
              "Please verify your email, sign up again to resend verification email",
            statusCode: 401,
          };
        //custom error
        case "OAuthAccountAlreadyLinked":
          return {
            success: false,
            error: "Login with your Google or Github account",
            statusCode: 401,
          };

        default:
          return {
            success: false,
            error: "Oops. Something went wrong",
            statusCode: 500,
          };
      }
    }
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
};
