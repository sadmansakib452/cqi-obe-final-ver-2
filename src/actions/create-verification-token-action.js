"use server"

import { VERIFICATION_TOKEN_EXP_MIN } from "@/lib/constants";
import db from "../../prisma";

export async function createVerificationTokenAction(identifier){
  const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXP_MIN * 60 * 1000);

  // Generate a random token
  const token = Math.random().toString(36).substring(2);

  // Insert the new verification token into the database
  const newVerificationToken = await db.verificationToken.create({
    data: {
      identifier: identifier,
      token: token,
      expires: expires,
    },
    select: {
      token: true,
    },
  });

  return newVerificationToken;
}