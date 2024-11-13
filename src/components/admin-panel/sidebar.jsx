import Link from "next/link";
import { PanelsTopLeft } from "lucide-react";
import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";
import { Button } from "../ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSession } from "next-auth/react"; // Import useSession for authentication

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const { data: session } = useSession(); // Get session data

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72",
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 bg-white dark:bg-[#18181b]">
        {/* Profile Section without Card Shape */}
        <ProfileSection session={session} isOpen={sidebar?.isOpen} />

        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}

// ProfileSection as a helper function within the same file
export function ProfileSection({ session, isOpen }) {
  
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 transition-all",
        "border-b border-gray-200 dark:border-gray-700", // Bottom border for a subtle separation
        "shadow-sm dark:shadow-md", // Soft shadow for a floating effect
        "bg-transparent", // Transparent background to blend with sidebar
        isOpen ? "justify-start mb-4" : "justify-center mb-2", // Conditional margins for spacing
        "mx-2", // Side margins for consistent spacing
      )}
    >
      {/* Profile Image or Fallback SVG Icon */}
      {session?.user?.image ? (
        <Image
          src={session.user.image}
          alt="User Profile Image"
          width={isOpen ? 56 : 40} // Fixed width and height based on sidebar state
          height={isOpen ? 56 : 40}
          className="rounded-full object-cover" // Ensures circular shape and image cover
          unoptimized // Bypass Next.js optimization for this image
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className={isOpen ? "w-14 h-14" : "w-10 h-10"}
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z"
            clipRule="evenodd"
            fill="#1d4ed8"
          />
          <path
            fillRule="evenodd"
            d="M3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
            fill="darkred"
          />
        </svg>
      )}

      {/* Conditionally render the user name and role text when sidebar is open */}
      {isOpen && (
        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {session ? `Hello, ${session.user.name}` : "Hello, Guest"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Faculty</p>
        </div>
      )}
    </div>
  );
}
