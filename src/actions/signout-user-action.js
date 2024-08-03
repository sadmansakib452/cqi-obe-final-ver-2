"use server";

import { signOut } from "@/auth";

export const signoutUserAction = async () => {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.error(error);
  }
};
