"use server";
import * as v from "valibot";
import { SignupSchema } from "@/validators/signup-validator";
import argon2 from "argon2";
import db from "../../prisma";
import { findAdminUserEmailAddresses } from "@/resources/admin-user-email-address-queries";
import { USER_ROLES } from "@/lib/constants";
import { createVerificationTokenAction } from "./create-verification-token-action";
import { sendSignupUserEmail } from "./mail/send-signup-user-email";

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
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (existingUser?.id) {
      if (!existingUser.emailVerified) {
        // Create a verification token if the user is not verified
        const verificationToken = await createVerificationTokenAction(
          existingUser.email,
        );

       await sendSignupUserEmail({
         email: existingUser.email,
         token: verificationToken.token,
       });
        return {
          success: false,
          error: "User exists but not verified. Verification link resent",
          statusCode: 409,
        };
      } else {
        return {
          success: false,
          error: "Email already exists",
          statusCode: 409,
        };
      }
    }
  } catch (error) {
    console.error("Error checking existing user:", error);
    return { success: false, error: "Internal Server Action", statusCode: 500 };
  }

  console.log("Proceeding with user creation: ", name, normalizedEmail);

  try {
    const hashedPassword = await argon2.hash(password);

    // const adminEmails = (
    //   process.env.ADMIN_EMAIL_ADDRESSES?.toLowerCase() || ""
    // ).split(",");

    const adminEmails = await findAdminUserEmailAddresses();
    const isAdmin = adminEmails.includes(email.toLowerCase());

    // Create the new user
    const newUser = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: isAdmin ? USER_ROLES.ADMIN : USER_ROLES.USER,
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });
    console.log({ insertedId: newUser.id }); // Log the ID of the new user

    // Create and send a verification token
    const verificationToken = await createVerificationTokenAction(
      newUser.email,
    );

    console.log(verificationToken)


    await sendSignupUserEmail({
      email: newUser.email,
      token: verificationToken.token
    })

    return { success: true };
  } catch (error) {
    console.error("Error creating new user:", error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
};
