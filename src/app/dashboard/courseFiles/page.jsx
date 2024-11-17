// File: /courseFiles/page.jsx

"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import PlaceholderContent from "@/components/demo/placeholder-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DynamicForm from "./_components/forms/DynamicForm";

// Dynamically import CourseFileProvider to disable SSR
const DynamicCourseFileProvider = dynamic(
  () =>
    import("./_components/context/CourseFileContext").then(
      (mod) => mod.CourseFileProvider,
    ),
  { ssr: false },
);

// Import useCourseFile after dynamic import
import { useCourseFile } from "./_components/context/CourseFileContext";
import CourseFileTable from "./_components/CourseFileTable";

/**
 * InnerContent component that consumes the CourseFileContext.
 *
 * @returns {JSX.Element} The InnerContent component.
 */
const InnerContent = () => {
  const {
    tableData,
    courseFileName,
    stateLoaded, // Add stateLoaded from context
  } = useCourseFile();

  // If state is not loaded yet, don't render the content
  if (!stateLoaded) {
    return null; // Or render a loading indicator
  }

  return (
    <ContentLayout title="Course Files">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Course Files</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Content */}
      <div className="bg-transparent py-8 min-h-screen transition-colors duration-300">
        <div className="container mx-auto p-4">
          {/* Dynamic Form */}
          <DynamicForm />

          {/* Course File Table */}
          {tableData && (
            <CourseFileTable
              courseFileName={courseFileName}
              tableData={tableData}
            />
          )}
        </div>
      </div>
    </ContentLayout>
  );
};

/**
 * Main page component.
 *
 * @returns {JSX.Element} The CourseFilePage component.
 */
const CourseFilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  /**
   * Redirect to sign-in page if not authenticated.
   */
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push("/api/auth/signin"); // Redirect to sign-in
  }, [session, status, router]);

  return (
    <DynamicCourseFileProvider>
      <InnerContent />
    </DynamicCourseFileProvider>
  );
};

export default CourseFilePage;
