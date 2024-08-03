import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const AuthLayout =  ({ children }) => {
    // const session = await auth()

    // if(session) redirect("/profile")
  return <>{children}</>;
};

export default AuthLayout;
