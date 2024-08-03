"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SiGithub,
  SiGithubHex,
  SiGoogle,
  SiGoogleHex,
} from "@icons-pack/react-simple-icons";
import { oauthSigninAction } from "@/actions/oauth-signin-action";
import { useSearchParams } from "next/navigation";

export const OauthSigninButton = ({ signup }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;
    if (error === "OAuthAccountNotLinked") {
      setErrorMessage("This account is already in use. Please sign in");
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
    <div className="max-w-[400px]">
      <Button
        variant="secondary"
        className="w-full"
        onClick={clickHandler.bind(null, "google")}
      >
        <SiGoogle color={SiGoogleHex} className="mr-2" />
        {text} with Google
      </Button>

      <Button
        variant="secondary"
        className="mt-2 w-full"
        onClick={clickHandler.bind(null, "github")}
      >
        <SiGithub color={SiGithubHex} className="mr-2" />
        {text} with Github
      </Button>
      {errorMessage && (
        <p className="mt-2 text-sm font-medium text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export const OAuthSigninButtonsSkeleton = ({ signup }) => {
  const text = signup ? "Sign up" : "Sign in";

  return (
    <div className="max-w-[400px]">
      <Button variant="secondary" className="w-full">
        <SiGoogle color={SiGoogleHex} className="mr-2" />
        {text} with Google
      </Button>

      <Button variant="secondary" className="mt-2 w-full">
        <SiGithub color={SiGithubHex} className="mr-2" />
        {text} with Github
      </Button>
    </div>
  );
};
