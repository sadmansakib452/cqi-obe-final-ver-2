import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};


/* alternative you can do authorize logic in the middleware.js file*/
// const auth = NextAuth(authConfig).auth;

// export default auth((request) => {
//   const { auth, nextUrl } = request;

//   const isLoggedIn = !!auth?.user;
//   const isOnProfile = nextUrl.pathname.startsWith("/profile");
//   const isOnAuth = nextUrl.pathname.startsWith("/auth");

//   if (isOnProfile) {
//     if (isLoggedIn) return ;
//     return Response.redirect(new URL("/auth/signin", nextUrl));
//   }

//   if (isOnAuth) {
//     if (!isLoggedIn) return ;
//     return Response.redirect(new URL("/profile", nextUrl));
//   }

//   return;
// });
