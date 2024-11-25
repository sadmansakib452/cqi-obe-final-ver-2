"use client";

import React, { useEffect, useState } from "react";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { oauthSigninAction } from "@/actions/oauth-signin-action";
import { useSearchParams } from "next/navigation";

export const OauthSigninButton = ({ signup }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;
    if (error === "OAuthAccountNotLinked") {
      setErrorMessage("This account is already in use. Please sign in.");
    } else {
      setErrorMessage("An error occurred. Please try again.");
    }
  }, [error]);

  const clickHandler = async (provider) => {
    try {
      await oauthSigninAction(provider);
    } catch (error) {
      console.log(error);
    }
  };
  const text = signup ? "Sign up" : "Sign in";
  return (
    <div className="space-y-4">
      <button
        className="w-full flex items-center justify-center bg-[#1C4370] hover:bg-[#16345A] text-white py-3 rounded-md transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#1C4370]/50"
        onClick={() => clickHandler("google")}
      >
        <SiGoogle className="mr-2" />
        {text} with Google
      </button>

      {errorMessage && (
        <p className="mt-2 text-sm font-medium text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
