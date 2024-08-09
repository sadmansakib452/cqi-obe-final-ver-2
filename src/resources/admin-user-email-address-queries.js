import "server-only";

import db from "../../prisma";

export const findAdminUserEmailAddresses = async () => {
  try {
    // Fetch all admin user email addresses
    const adminUserEmailAddresses =
      await db.adminUserEmailAddresses.findMany({
        select: {
          email: true,
        },
      });

    // Map and return the emails as a list of strings
    return adminUserEmailAddresses.map((item) => item.email);
  } catch (error) {
    console.error("Error fetching admin user email addresses:", error);
    throw new Error("Failed to fetch admin user email addresses.");
  }
};