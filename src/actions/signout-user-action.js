// File: /app/api/auth/signout.js (or wherever signoutUserAction is located)
"use server";
import { signOut } from "next-auth/react";

export const signoutUserAction = async () => {
  try {
    // Immediate clearing of localStorage before signOut finishes
    if (typeof window !== "undefined") {
      localStorage.removeItem("tableData");
      localStorage.removeItem("courseFileName");
    }

    await signOut({ redirect: true });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
