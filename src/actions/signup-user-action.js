"use server";
import * as v from "valibot";
import { SignupSchema } from "@/validators/signup-validator";
import argon2 from "argon2";
import db from "../../prisma";

export const signupUserAction = async (values) => {
  const parsedValues = v.safeParse(SignupSchema, values);

  if (!parsedValues.success) {
    const flatErrors = v.flatten(parsedValues.issues);
    console.log(flatErrors);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  // Normalize email to lowercase before any operation
  const { name, email, password } = parsedValues.output;
  const normalizedEmail = email.toLowerCase();

  try {
    // Check for existing user with the normalized email
    const existingUser = await db.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser?.id) {
      console.log("User already exists with this email.");
      return { success: false, error: "Email already exists", statusCode: 409 };
    }
  } catch (error) {
    console.error("Error checking existing user:", error);
    return { success: false, error: "Internal Server Action", statusCode: 500 };
  }

  console.log("Proceeding with user creation: ", name, normalizedEmail);

  try {
    const hashedPassword = await argon2.hash(password);
    const adminEmails = (
      process.env.ADMIN_EMAIL_ADDRESSES?.toLowerCase() || ""
    ).split(",");

    const isAdmin = adminEmails.includes(email.toLowerCase());

    // Create the new user with the normalized email
    const newUser = await db.user.create({
      data: {
        name: name,
        email: normalizedEmail, // Store the email in lowercase
        password: hashedPassword,
        role: isAdmin ? "admin" : "user",
      },
    });
    console.log({ insertedId: newUser.id }); // Log the ID of the new user

    return { success: true };
  } catch (error) {
    console.error("Error creating new user:", error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
};
