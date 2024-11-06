// File: src/app/dashboard/courseFiles/page.jsx

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
import Loader from "@/components/ui/table/Loader";

import { useCourseFile } from "@/context/CourseFileContext";
import CourseFileTable from "./_components/CourseFileTable";
import { Button } from "@/components/ui/button";
import { DocumentChartBarIcon } from "@heroicons/react/24/solid"; // Updated Icon
import CourseFileForm from "./_components/CourseFileForm";

export default function CourseFilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { courseFileName, setCourseFileName, tableData, setTableData } =
    useCourseFile();
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false); // State for Review Modal

  // Auto-dismiss for success messages
  useEffect(() => {
    if (successMessage) {
      const successTimer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(successTimer);
    }
  }, [successMessage]);

  // Auto-dismiss for error messages
  useEffect(() => {
    if (errorMessage) {
      const errorTimer = setTimeout(() => setErrorMessage(""), 4000);
      return () => clearTimeout(errorTimer);
    }
  }, [errorMessage]);

  /**
   * Fetches course file data by name.
   *
   * @param {string} fileName - The name of the course file to fetch.
   */
  const fetchCourseFileData = async (fileName) => {
    try {
      const response = await fetch(
        `/api/course/user/viewCourseFileByName?courseFileName=${fileName}`
      );

      if (response.ok) {
        const result = await response.json();
        setTableData(result.courseFile);
      } else {
        setErrorMessage("Error fetching course file data after creation.");
      }
    } catch (error) {
      console.error("Error fetching course file data:", error);
      setErrorMessage("An unexpected error occurred while fetching data.");
    }
  };

  /**
   * Handles the submission of the course file creation form.
   *
   * @param {Object} data - The form data containing the course file name.
   */
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
        setErrorMessage("Course file already exists.");
      }
    } catch (error) {
      console.error("Error creating course file:", error);
      setErrorMessage("An unexpected error occurred while creating the course file.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the submission of the course file search form.
   *
   * @param {Object} data - The form data containing the course file name.
   */
  const handleCourseFileSearch = async (data) => {
    setIsSearching(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `/api/course/user/viewCourseFileByName?courseFileName=${data.courseFileName}`
      );
      const result = await response.json();

      if (response.ok && result.courseFile) {
        setTableData(result.courseFile);
        setCourseFileName(data.courseFileName);
        setSuccessMessage("Course file found!");
      } else {
        setErrorMessage("Course file not found.");
        setTableData(null);
      }
    } catch (error) {
      console.error("Error searching course file:", error);
      setErrorMessage("An unexpected error occurred while searching for the course file.");
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handles the opening of the Review modal.
   */
  const handleOpenReview = () => {
    setIsReviewOpen(true);
  };

  /**
   * Handles the closing of the Review modal.
   */
  const handleCloseReview = () => {
    setIsReviewOpen(false);
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
          {/* Success Message */}
          {successMessage && (
            <p className="text-green-500 text-sm mb-4">{successMessage}</p>
          )}

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          {/* Course File Form */}
          <CourseFileForm
            onSubmit={handleCourseFileSubmit}
            onSearch={handleCourseFileSearch}
            defaultCourseFileName={courseFileName}
          />

          {/* Loading Indicator */}
          {(loading || isSearching) && (
            <div className="flex justify-center items-center mt-6">
              <Loader />
            </div>
          )}

          {/* Review Button */}
          {tableData && (
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleOpenReview}
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <DocumentChartBarIcon className="h-5 w-5" />
                <span>Review</span>
              </Button>
            </div>
          )}

          {/* Course File Table */}
          <div className="overflow-x-auto mt-4">
            {tableData ? (
              <CourseFileTable
                courseFileName={courseFileName}
                tableData={tableData}
                userId={session?.user?.id}
                refreshTable={fetchCourseFileData} // Pass the refresh function to the table
              />
            ) : (
              !loading &&
              !isSearching && (
                <p className="text-gray-500 text-sm text-center">
                  No course file data to display. Create or search for a course
                  file.
                </p>
              )
            )}
          </div>

          {/* Review Modal */}
          {isReviewOpen && tableData && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={handleCloseReview}
            >
              <div
                className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-11/12 max-w-3xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Review Course Files
                  </h2>
                  <button
                    onClick={handleCloseReview}
                    className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    &times;
                  </button>
                </div>
                <div className="overflow-y-auto max-h-96">
                  {/* Detailed Review Content */}
                  <ul className="space-y-2">
                    {/* Loop through single file items */}
                    {[
                      "finalGrades",
                      "summaryObe",
                      "insFeedback",
                      "courseOutline",
                      "assignment",
                      "labExperiment",
                    ].map((key) => (
                      <li key={key} className="flex justify-between items-center">
                        <span className="capitalize">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                            .trim()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tableData[key]
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tableData[key] ? "Uploaded" : "Not Uploaded"}
                        </span>
                      </li>
                    ))}

                    {/* Loop through multiple file items */}
                    {[
                      { key: "midExams", label: "Mid Exam" },
                      { key: "quizExams", label: "Quiz Exam" },
                      { key: "finalExam", label: "Final Exam" },
                    ].map(({ key, label }) => {
                      const exams = tableData[key] || [];
                      const totalExams = exams.length;
                      const completedExams = exams.filter(
                        (exam) =>
                          exam.question &&
                          exam.highest &&
                          exam.average &&
                          exam.marginal
                      ).length;
                      const status =
                        completedExams === totalExams && totalExams > 0
                          ? "Completed"
                          : "Incomplete";
                      return (
                        <li key={key} className="flex justify-between items-center">
                          <span className="capitalize">{label}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {status}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </ContentLayout>
    );
}
