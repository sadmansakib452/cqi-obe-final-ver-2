"use client";

import { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { siteConfig } from "@/config/site";
import { settings } from "./settings";
import Sidebar from "./sidebar";
import { AuthButtons } from "@/components/auth-button";
import { navLinks } from "./links"; // Import navLinks here

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="select-none">
      <nav className="mt-4 mx-auto flex justify-between items-center px-4 md:px-8 lg:max-w-7xl">
        {/* Logo */}
        <Link href="/" onClick={() => setSidebarOpen(false)}>
          <h1 className="text-2xl font-bold duration-200 lg:hover:scale-[1.10]">
            {siteConfig.name}
          </h1>
        </Link>

        {/* Navigation Links for Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.route} href={link.path} className="hover:underline">
              {link.route}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex gap-1 md:hidden">
          <button
            className="rounded-md p-2 text-primary outline-none focus:border focus:border-primary"
            aria-label="Hamburger Menu"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ModeToggle />
        </div>

        {/* Sidebar Component */}
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Auth Buttons and Dark Mode Toggle for Desktop */}
        {settings.themeToggleEnabled && (
          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
            <ModeToggle />
          </div>
        )}
      </nav>
    </header>
  );
}
