"use client";

import { useEffect } from "react";
import Link from "next/link";
import { navLinks } from "./links";
import { AuthButtons } from "@/components/auth-button"; // Import AuthButtons
import { siteConfig } from "@/config/site";

export default function Sidebar({ open, toggleSidebar }) {
  // Close sidebar on route change
  useEffect(() => {
    const handleRouteChange = () => {
      toggleSidebar(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [toggleSidebar]);

  return (
    <div
      className={`fixed inset-0 z-20 transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 bg-background p-6 md:hidden`}
    >
      {/* Branding Section */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/" onClick={toggleSidebar}>
          <h1 className="text-2xl font-bold">{siteConfig.name}</h1>
        </Link>
        <button
          className="text-primary focus:outline-none"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <hr className="my-4 border-t border-primary opacity-30" />

      {/* Navigation Links */}
      <ul className="flex flex-col space-y-4">
        {navLinks.map((link) => (
          <li key={link.route}>
            <Link
              href={link.path}
              className="text-lg text-primary opacity-70 hover:underline"
              onClick={toggleSidebar}
            >
              {link.route}
            </Link>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <hr className="my-4 border-t border-primary opacity-30" />

      {/* Auth Buttons */}
      <div className="mt-4">
        <AuthButtons />
      </div>
    </div>
  );
}
