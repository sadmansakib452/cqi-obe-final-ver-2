"use server";

import { findUserByEmail } from "@/resources/user-queries";
import { findVerificationTokenByToken } from "@/resources/verification-token-queries";
import db from "../../prisma";

export async function verifyCredentialsEmailAction(token) {
  const verificationToken = await findVerificationTokenByToken(token);

  if (!verificationToken?.expires) return { success: false };

  if (new Date(verificationToken.expires) < new Date()) {
    return { success: false };
  }

  const existingUser = await findUserByEmail(verificationToken.identifier);

  if (
    existingUser?.id &&
    !existingUser.emailVerified &&
    existingUser.email === verificationToken.identifier
  ) {
    // Update the user's emailVerified field
    await db.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date() },
    });

    // Invalidate the token by setting its expiration to now
    await db.verificationToken.updateMany({
      where: { identifier: existingUser.email },
      data: { expires: new Date() },
    });

    return { success: true };
  } else {
    return { success: false };
  }
}
