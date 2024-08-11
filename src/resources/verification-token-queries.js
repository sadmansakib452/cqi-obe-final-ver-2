import "server-only";
import db from "../../prisma";

export async function findVerificationTokenByToken(token) {
  const verificationToken = await db.VerificationToken.findFirst({
    where: {
      token: token,
    },
  });

  return verificationToken || null;
}
