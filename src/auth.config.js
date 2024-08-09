import db from "../prisma";
import { oauthVerifyEmailAction } from "./actions/oauth-verify-email-action";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { findAdminUserEmailAddresses } from "./resources/admin-user-email-address-queries";
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
      insertedData.role = isAdmin ? "admin" : "user";

      // Create the user with the modified data (without the original 'id' and with the assigned role)
      return await db.user.create({
        data: insertedData,
      });
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/signin" },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;

      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isOnProfile) {
        if (isLoggedIn) return true;
        return Response.redirect(new URL("/auth/signin", nextUrl));
      }

      if (isOnAuth) {
        if (!isLoggedIn) return true;
        return Response.redirect(new URL("/profile", nextUrl));
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
        /**Taking care of the care where an OAuth user 
        creates An account for the first time and they should be "admin"
        Fixed by overriding 'createUser' function in Prisma Adapter  */
      }
      //updating role
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
    signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }
      if (account?.provider === "github") {
        return true;
      }
      if (account?.provider === "credentials") {
        if (user.emailVerified) {
          //return true
        }
        return true;
      }
      return false;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      if (["google", "github"].includes(account.provider)) {
        //verify user email
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
