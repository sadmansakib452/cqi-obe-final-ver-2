"use server";
import { findUserByEmail } from "@/resources/user-queries";
import db from "../../../prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const changeUserRoleAction = async (email, newRole) => {
  console.log(email, newRole)
  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const existingUser = await findUserByEmail(email);

  if (!existingUser?.id) return;
  if (existingUser.role === "admin") return;
  if (existingUser.role === newRole) return;

  try {
    const updatedUser = await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        role: newRole,
      },
    });

    revalidatePath("/profile/admin-panel")

    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
};
