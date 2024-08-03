import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import argon2 from "argon2";
import * as v from "valibot";
import { SigninSchema } from "@/validators/signin-validator";
import { findUserByEmail } from "@/resources/user-queries";
import { oauthVerifyEmailAction } from "./actions/oauth-verify-email-action";
import { OAuthAccountAlreadyLinkederror } from "./lib/custom-errors";
import { authConfig } from "./auth.config"; 
const { providers: authConfigProviders, ...authConfigRest } = authConfig;
const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [
    ...authConfigProviders,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = v.safeParse(SigninSchema, credentials);

        if (parsedCredentials.success) {
          //CARRY ON WITH SIGNING IN
          const { email, password } = parsedCredentials.output;

          //Look for our user in the database
          const user = await findUserByEmail(email);
          if (!user) return null;
          if (!user.password) throw new OAuthAccountAlreadyLinkederror();

          const passwordsMatch = await argon2.verify(user.password, password);

          if (passwordsMatch) {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }

          console.log(user);
        }

        return null;
      },
    }),
  ],
});

export const { signIn, auth, signOut, handlers } = nextAuth;
