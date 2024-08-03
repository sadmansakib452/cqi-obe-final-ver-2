"use server";
import { findUserByEmail } from "@/resources/user-queries";
import db from "../../prisma";

export const changeUserRoleAction = async (email, newRole) => {
    
  const existingUser = await findUserByEmail(email);

  if (existingUser?.id && existingUser.role !== newRole) {
    try {
        const updatedUser = await db.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            role: newRole,
          },
        });

        console.log(updatedUser)
        
    } catch (error) {
        console.log(error)
    }
  }
};
