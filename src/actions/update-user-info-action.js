"use server";

import * as v from "valibot";
import { UpdateUserInfoSchema } from "@/validators/update-user-info-validator";
import { auth } from "@/auth";
import db from "../../prisma";

export const updateUserInfoAction = async (values) => {
  const parsedValues = v.safeParse(UpdateUserInfoSchema, values);

  if (!parsedValues.success) {
    const flatErrors = v.flatten(parsedValues.issues);

    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const { id, name } = parsedValues.output;

  const session = await auth();

  if (!session?.user?.id || session.user.id !== id) {
    return { status: false, error: "Unauthorized", statusCode: 401 };
  }

  if (session.user.name === name) {
    return { success: true, data: { id, name } };
  }

  try {
    // Update the user's name based on the given id and return the updated user details
    const updatedUser = await db.user.update({
      where: { id: id },
      data: { name: name },
      select: { id: true, name: true }, // Selecting only the id and name to return
    });

    return { success: true, data: updatedUser };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
};
