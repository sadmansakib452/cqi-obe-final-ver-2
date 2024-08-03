"use server";
import db from "../../prisma";

export async function oauthVerifyEmailAction(email) {
  try {
    console.log("Attempting to verify email for:", email);
    // Fetch users that might match the conditions
    const potentialUsers = await db.user.findMany({
      where: {
        email: email, // Email matches the provided email
        // Remove password and emailVerified from the query to handle them manually later
      },
    });

    // Manually filter for users with null password and emailVerified
    const existingUser = potentialUsers.find(
      (user) => user.password === null && user.emailVerified === null,
    );

    console.log("Evaluated user:", existingUser);

    // If such a user exists, update their emailVerified field to the current date
    if (existingUser) {
      await db.user.update({
        where: {
          id: existingUser.id, // Use the existing user's id for the update condition
        },
        data: {
          emailVerified: new Date(), // Set the emailVerified to current date/time
        },
      });
      console.log("Email verified for user:", existingUser.id);
    } else {
      console.log("No suitable user found or user already verified.");
    }
  } catch (error) {
    console.error("Error in verifying email:", error);
  }
}
