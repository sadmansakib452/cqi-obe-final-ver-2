import { getSession } from "next-auth/react";

export const ensureAuthenticated = async (req) => {
  const session = await getSession({ req });
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};
