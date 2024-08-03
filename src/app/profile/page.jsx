import { auth } from "@/auth";
import SignoutButton from "@/components/signout-button";
import { Button } from "@/components/ui/button";
// import { findUserById, findUserByAuth } from "@/resources/user-queries";
import Link from "next/link";
import React from "react";
import { UpdateUserInfoForm } from "./_components/update-user-info-form";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth();
  if(!session) redirect("/auth/signin")

  //Access user information from database via session user id
  // const sessionUserId = session?.user?.id
  // let databaseUser
  // if(sessionUserId) databaseUser = await findUserById(sessionUserId);

  // Access user information from database via auth
  // const databaseUser = await findUserByAuth()

  return (
    <main className="mt-4">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <div className="my-4 h-1 bg-muted" />

        {!!session?.user ? <SignedIn user={session.user} /> : <SignedOut />}
      </div>
    </main>
  );
};

const SignedIn = ({ user }) => {
  return (
    <>
      <div className="flex item-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">User Information</h2>
        <UpdateUserInfoForm user={user}/>
      </div>
      <table className="mt-4 table-auto divide-y">
        <thead>
          <tr className="divide-x">
            <th className="bg-gray-50 px-6 py-3 text-start">id</th>
            <th className="bg-gray-50 px-6 py-3 text-start">Name</th>
            <th className="bg-gray-50 px-6 py-3 text-start">email</th>
            <th className="bg-gray-50 px-6 py-3 text-start">role</th>
          </tr>
        </thead>

        <tbody>
          <tr className="divide-x">
            <td className="px-6 py-3">{user.id}</td>
            <td className="px-6 py-3">{user.name || "NULL"}</td>
            <td className="px-6 py-3">{user.email || "NULL"}</td>
            <td className="px-6 py-3 uppercase">{user.role || "NULL"}</td>
          </tr>
        </tbody>
      </table>

      <div className="my-2 h-1 bg-muted" />

      <SignoutButton />
    </>
  );
};

const SignedOut = () => {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">User Not Signed In</h2>

      <div className="my-2 h-1 bg-muted" />

      <Button asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    </>
  );
};

export default ProfilePage;
