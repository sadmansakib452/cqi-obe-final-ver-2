// File: /courseFiles/_components/ui/Breadcrumb.jsx

"use client";

import React from "react";
import Link from "next/link";

/**
 * Breadcrumb component for navigation.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The breadcrumb items.
 * @returns {JSX.Element} The Breadcrumb component.
 */
export const Breadcrumb = ({ children }) => {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {children}
      </ol>
    </nav>
  );
};

/**
 * BreadcrumbList component to group breadcrumb items.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The breadcrumb items.
 * @returns {JSX.Element} The BreadcrumbList component.
 */
export const BreadcrumbList = ({ children }) => {
  return <>{children}</>;
};

/**
 * BreadcrumbItem component for each breadcrumb.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isLast - Whether this is the last breadcrumb.
 * @param {React.ReactNode} props.children - The breadcrumb link or page.
 * @returns {JSX.Element} The BreadcrumbItem component.
 */
export const BreadcrumbItem = ({ isLast, children }) => {
  return (
    <li className="inline-flex items-center">
      {children}
      {!isLast && (
        <svg
          className="w-6 h-6 text-gray-400 mx-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </li>
  );
};

/**
 * BreadcrumbLink component for navigable breadcrumb links.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The link content.
 * @param {string} props.href - The URL to link to.
 * @returns {JSX.Element} The BreadcrumbLink component.
 */
export const BreadcrumbLink = ({ children, href }) => {
  return (
    <Link href={href}>
      <a className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700">
        {children}
      </a>
    </Link>
  );
};

/**
 * BreadcrumbPage component for the current page in breadcrumbs.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The page name.
 * @returns {JSX.Element} The BreadcrumbPage component.
 */
export const BreadcrumbPage = ({ children }) => {
  return (
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {children}
    </span>
  );
};
