import "server-only";

import db from "../../prisma";
import { auth } from "@/auth";
import { USER_ROLES } from "@/lib/constants";


/* ADMIN QUERIES - THESE QUERIES REQUIRE ADMIN ACCESS*/


export async function findAllUsers() {
  const session = await auth();

  if (session?.user?.role !== USER_ROLES.ADMIN) {
    throw new Error("Unauthorized");
  }

  // Fetch all users, excluding the password field
  const allUsers = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      // Exclude the password field
    },
    orderBy: {
      role: "desc", // Order by role in descending order
    },
  });

  return allUsers;
}


/*----------------------------------------------------*/

export const findUserByEmail = async (email) => {
  // Ensure the email is in lowercase before querying
  const normalizedEmail = email.toLowerCase();

  // Use Prisma's client to find the user by normalized email
  const user = await db.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  return user;
};

// export const findUserById = async (id) => {
//   try {
//     // Fetch the user by ID while explicitly selecting only necessary fields
//     const user = await db.user.findUnique({
//       where: { id: id },
//       select: {
//         id: true,
//         name: true, // Include only the fields shown in the output
//         email: true,
//         emailVerified: true,
//         image: true,
//         role: true,
//       },
//     });

//     if (!user) throw new Error("User not found.");

//     return user;
//   } catch (error) {
//     console.error("Error finding user by ID:", error);
//     throw error; // Rethrow or handle error as needed
//   }
// };

// export const findUserByAuth = async () => {
//   const session = await auth();

//   const sessionUserId = session?.user?.id;
//   if (!sessionUserId) throw new Error("Unauthorized");

//   try {
//     // Fetch the user by ID while explicitly selecting only necessary fields
//     const user = await db.user.findUnique({
//       where: { id: sessionUserId },
//       select: {
//         id: true,
//         name: true, // Include only the fields shown in the output
//         email: true,
//         emailVerified: true,
//         image: true,
//         role: true,
//       },
//     });

//     if (!user) throw new Error("User not found.");

//     return user;
//   } catch (error) {
//     console.error("Error finding user by ID:", error);
//     throw error; // Rethrow or handle error as needed
//   }
// };
