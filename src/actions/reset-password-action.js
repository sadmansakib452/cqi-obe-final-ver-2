"use server";

import { findUserByEmail } from "@/resources/user-queries";
import { findVerificationTokenByToken } from "@/resources/verification-token-queries";
import { ResetPasswordSchema } from "@/validators/reset-password-validator";
import argon2 from "argon2";
import * as v from "valibot";
import db from "../../prisma";

export async function resetPasswordAction(email, token, values) {
  const parsedValues = v.safeParse(ResetPasswordSchema, values);

  if (!parsedValues.success) {
    const flatErrors = v.flatten(parsedValues.issues);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const password = parsedValues.output.password;

  const existingToken = await findVerificationTokenByToken(token);

  if (!existingToken?.expires) {
    return {
      success: false,
      error: "Token is invalid",
      statusCode: 401,
    };
  }

  if (new Date(existingToken.expires) < new Date()) {
    return {
      success: false,
      error: "Token is expired",
      statusCode: 401,
    };
  }

  const existingUser = await findUserByEmail(email);
  if (
    !existingUser?.password ||
    existingUser.email !== existingToken.identifier
  ) {
    return {
      success: false,
      error: "Oops, something went wrong",
      statusCode: 401,
    };
  }

  try {
    const hashedPassword = await argon2.hash(password);

    // Update the user's password in the database
    await db.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}
