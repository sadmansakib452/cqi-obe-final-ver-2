// File: /src/auth.config.js

/**
 * @fileoverview Configuration for NextAuth.js authentication.
 * Integrates dynamic authorization logic while preserving core functionalities.
 */

import db from "../prisma";
import { oauthVerifyEmailAction } from "./actions/oauth-verify-email-action";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { findAdminUserEmailAddresses } from "./resources/admin-user-email-address-queries";
import { USER_ROLES } from "./lib/constants";
import { authorizeEmail } from "./lib/authorization";

// import { changeUserRoleAction } from "./actions/change-user-role-action";

export const authConfig = {
  adapter: {
    ...PrismaAdapter(db),
    createUser: async (data) => {
      const { id, ...insertedData } = data; // Destructure to exclude 'id' from the insertion data

      // Retrieve and process the list of admin emails from the database
      const adminEmails = await findAdminUserEmailAddresses();

      // Check if the provided email is one of the admin emails
      const isAdmin = adminEmails.includes(insertedData.email.toLowerCase());

      // Assign the role based on admin status
      insertedData.role = isAdmin ? USER_ROLES.ADMIN : USER_ROLES.USER;

      // Create the user with the modified data (without the original 'id' and with the assigned role)
      return await db.user.create({
        data: insertedData,
      });
    },
  },

  // Trust host setting to ensure custom domain works
  trustHost: true, // You can specify domains explicitly as ['sadman-workbench.zapto.org'] if needed

  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/signin", error: "/auth/error" },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;

      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isOnProfile || isOnDashboard) {
        if (isLoggedIn) return true;
        return Response.redirect(new URL("/auth/signin", nextUrl));
      }

      if (isOnAuth) {
        if (!isLoggedIn) return true;
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      if (user?.id) token.id = user.id;
      if (user?.role) token.role = user.role;

      {
        /**Taking care of the case where an OAuth user 
        creates an account for the first time and they should be "admin"
        Fixed by overriding 'createUser' function in Prisma Adapter  */
      }
      // Updating role
      // if (
      //   user?.email &&
      //   process.env.ADMIN_EMAIL_ADDRESS?.toLowerCase() === user.email.toLowerCase()
      // ) {
      //   token.role = "admin";
      // }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    /**
     * Controls user sign-in flow based on provider, email verification,
     * and authorization criteria (specific emails and domains).
     *
     * @param {Object} param0 - Destructured parameters.
     * @param {Object} param0.user - The user object.
     * @param {Object} param0.account - The account object.
     * @param {Object} param0.profile - The profile object.
     * @returns {boolean} True to allow sign-in, false to deny.
     */
    signIn: async ({ user, account, profile }) => {
      // Define allowed emails and domains (from environment variables)
      const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS
        ? process.env.ALLOWED_EMAILS.split(",").map((email) => email.trim())
        : [];

      const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS
        ? process.env.ALLOWED_DOMAINS.split(",").map((domain) => domain.trim())
        : [];

      // Authorize the user's email
      const isAuthorized = await authorizeEmail(user.email);

      if (account?.provider === "google" && isAuthorized) {
        return !!profile?.email_verified;
      }

      if (account?.provider === "github" && isAuthorized) {
        return true;
      }

      if (account?.provider === "credentials") {
        if (user.emailVerified && isAuthorized) {
          return true;
        }
      }

      return false;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      if (["google", "github"].includes(account.provider)) {
        // Verify user email
        if (user.email) await oauthVerifyEmailAction(user.email);
      }
    },
    // async createUser({user}){
    //   if(user.email && process.env.ADMIN_EMAIL_ADDRESS?.toLowerCase() === user.email.toLowerCase()){
    //     await changeUserRoleAction(user.email, "admin")
    //   }

    // },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
