"use server";

import { findUserByEmail } from "@/resources/user-queries";
import { ForgotPasswordSchema } from "@/validators/forgot-password-validator";
import * as v from "valibot";
import { createVerificationTokenAction } from "./create-verification-token-action";
import { sendForgotPasswordEmail } from "./mail/send-forgot-password-email";

export async function forgotPasswordAction(values) {
  const parsedValues = v.safeParse(ForgotPasswordSchema, values);

  if (!parsedValues.success) {
    const flatErrors = v.flatten(parsedValues.issues);

    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const email = parsedValues.output.email;

  try {
    const existingUser = await findUserByEmail(email);

    //this is a false positive, to determine malicious users
    if (!existingUser?.id) return { success: true };

    if (!existingUser.password) {
      return {
        success: false,
        error: "This user was created with OAuth, please sign in with OAuth",
        statusCode: 401,
      };
    }

    // if(!existingUser.email){
    //     return {
    //       success: false,
    //       error: "Email not found.",
    //       statusCode: 401,
    //     };
    // }

    const verificationToken = await createVerificationTokenAction(
      existingUser.email,
    );

    
    await sendForgotPasswordEmail({
      email: existingUser.email,
      token: verificationToken.token,
    });
    return { success: true };
  } catch (error) {
    console.error(error);

    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}
