"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useSession } from "next-auth/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CourseFileForm from "./_components/CourseFileForm";
import Loader from "@/components/ui/table/Loader";

import { useCourseFile } from "@/context/CourseFileContext";
import CourseFileTable from "@/components/ui/table/CourseFileTable";

export default function CourseFilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { courseFileName, setCourseFileName, tableData, setTableData } =
    useCourseFile();
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-dismiss for success and error messages
  useEffect(() => {
    if (errorMessage) {
      const errorTimer = setTimeout(() => setErrorMessage(""), 4000);
      return () => clearTimeout(errorTimer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const successTimer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(successTimer);
    }
  }, [successMessage]);

  // Fetch course file data by name
  const fetchCourseFileData = async (fileName) => {
    try {
      const response = await fetch(
        `/api/course/user/viewCourseFileByName?courseFileName=${fileName}`,
      );

      if (response.ok) {
        const result = await response.json();
        setTableData(result.courseFile);
      } else {
        setErrorMessage("Error fetching course file data after creation.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred while fetching data.");
    }
  };

  // Handle course file creation
  const handleCourseFileSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/course/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseFileName: data.courseFileName,
          userId: session?.user?.id,
        }),
      });

      if (response.ok) {
        setCourseFileName(data.courseFileName);
        setSuccessMessage("Course file created successfully!");
        await fetchCourseFileData(data.courseFileName);
      } else {
        setErrorMessage("Course files already exists.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle course file search
  const handleCourseFileSearch = async (data) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/course/user/viewCourseFileByName?courseFileName=${data.courseFileName}`,
      );
      const result = await response.json();

      if (response.ok && result.courseFile) {
        setTableData(result.courseFile);
        setCourseFileName(data.courseFileName);
      } else {
        setErrorMessage("Course file not found.");
        setTableData(null);
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ContentLayout title="Course Files">
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

      <div className="bg-gray-50 dark:bg-zinc-900 py-8 min-h-screen transition-colors duration-300">
        <div className="container mx-auto p-4">
          {successMessage && (
            <p className="text-green-500 text-sm mb-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <CourseFileForm
            onSubmit={handleCourseFileSubmit}
            onSearch={handleCourseFileSearch}
            defaultCourseFileName={courseFileName}
          />

          {(loading || isSearching) && (
            <div className="flex justify-center items-center mt-6">
              <Loader />
            </div>
          )}

          <div className="overflow-x-auto mt-4">
            {tableData ? (
              <CourseFileTable
                courseFileName={courseFileName}
                tableData={tableData}
              />
            ) : (
              <p className="text-gray-500 text-sm text-center">
                No course file data to display. Create or search for a course
                file.
              </p>
            )}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
