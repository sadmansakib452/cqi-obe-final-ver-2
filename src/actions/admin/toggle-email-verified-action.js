"use server";

import { auth } from "@/auth";
import { findUserByEmail } from "@/resources/user-queries";
import db from "../../../prisma";
import { revalidatePath } from "next/cache";
import { USER_ROLES } from "@/lib/constants";

//ADMIN PANEL ACTION
export async function toggleEmailVerifiedAction(email, isCurrentlyVerified) {
  const session = await auth();

  if (session?.user?.role !== USER_ROLES.ADMIN) {
    throw new Error("Unauthorized");
  }

  const existingUser = await findUserByEmail(email);

  if (!existingUser) return;
  if (existingUser.role === USER_ROLES.ADMIN) return;

  const emailVerified = isCurrentlyVerified ? null : new Date();

  // Update the user's emailVerified field
  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified },
  });

  // Revalidate the admin panel page
  revalidatePath("/profile/admin-panel");
}
