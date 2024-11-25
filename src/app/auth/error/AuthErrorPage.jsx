"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AiOutlineLock } from "react-icons/ai"; // Import lock icon from react-icons

const errorMessages = {
  AccessDenied: "You do not have permission to access this application.",
  Configuration: "There is a problem with the server configuration.",
  Verification: "Your verification token is invalid or has expired.",
  OAuthCallback: "An error occurred during the authentication process.",
  Default: "An unexpected error has occurred.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = errorMessages[error] || errorMessages.Default;
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/auth/signin");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      {/* Content Container */}
      <div className="w-full max-w-md px-8 py-10 bg-white shadow-lg rounded-lg mx-4 text-center">
        {/* Animated Lock Icon */}
        <motion.div
          animate={{ y: [0, -15, 0], opacity: [1, 0.9, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          className="flex justify-center mb-6"
        >
          <AiOutlineLock className="text-red-500 h-20 w-20" />
        </motion.div>

        {/* Error Title */}
        <h1 className="text-3xl font-extrabold text-red-600 mb-4">
          Authentication Error
        </h1>

        {/* Error Message */}
        <p className="text-lg text-gray-600 mb-8">{errorMessage}</p>

        {/* Go Back Button */}
        <button
          onClick={handleGoBack}
          className="w-full bg-[#1C4370] hover:bg-[#16345A] text-white py-3 rounded-md transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#1C4370]/50"
        >
          Go Back to Sign In
        </button>
      </div>
    </main>
  );
}
