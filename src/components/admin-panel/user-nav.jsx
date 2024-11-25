"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User, MoreVertical } from "lucide-react"; // Use MoreVertical for vertical three-dot icon
import { Menu } from "@headlessui/react"; // Import Headless UI Menu
import { useSession } from "next-auth/react";
import { useCourseFile } from "@/app/dashboard/courseFiles/_components/context/CourseFileContext";

export function UserNav() {
  const session = useSession();
  const { logoutHandler } = useCourseFile();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex items-center">
        {/* Tooltip container */}
        <div className="group relative">
          {/* Three-dot button as Menu Trigger */}
          <Menu.Button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />{" "}
            {/* Vertical three-dot icon */}
          </Menu.Button>

          {/* Tooltip - positioned at the bottom */}
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1">
            Menu
          </span>
        </div>
      </div>

      {/* Dropdown Menu */}
      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-white dark:bg-gray-800 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <div className="px-4 py-2">
                <p className="text-sm font-medium">
                  {session?.data?.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session?.data?.user?.email}
                </p>
              </div>
            )}
          </Menu.Item>

          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          <Menu.Item>
            {({ active }) => (
              <Link
                href="/dashboard"
                className={`${
                  active ? "bg-gray-100 dark:bg-gray-700" : ""
                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
              >
                <LayoutGrid className="w-4 h-4 mr-3" />
                Dashboard
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                href="/account"
                className={`${
                  active ? "bg-gray-100 dark:bg-gray-700" : ""
                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
              >
                <User className="w-4 h-4 mr-3" />
                Account
              </Link>
            )}
          </Menu.Item>

          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logoutHandler}
                className={`${
                  active ? "bg-gray-100 dark:bg-gray-700" : ""
                } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign out
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
