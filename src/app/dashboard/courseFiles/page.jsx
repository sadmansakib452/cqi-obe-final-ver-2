// File: /courseFiles/page.jsx

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

import SemesterDropdown from "./_components/SemesterDropdown";
import ShowCoursesButton from "./_components/ShowCoursesButton";
import CourseDropdown from "./_components/CourseDropdown";
import ShowCourseButton from "./_components/ShowCourseButton";

import { generateCourseFileName } from "./_components/utils";
import offeredCoursesData from "./_components/data/offeredCourses.json";

/**
 * Main component for the Course Files page.
 *
 * @returns {JSX.Element} The CourseFilesPage component.
 */
export default function CourseFilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    courseFileName,
    setCourseFileName,
    tableData,
    setTableData,
    selectedSemester,
    setSelectedSemester,
    selectedCourse,
    setSelectedCourse,
    logoutHandler,
  } = useCourseFile();
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false); // State for Review Modal

  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);

  /**
   * Initializes the semester data on component mount.
   */
  useEffect(() => {
    const fetchSemesters = () => {
      const semesterKeys = Object.keys(offeredCoursesData);
      setSemesters(semesterKeys);
      console.log("🔄 Initialized semesters:", semesterKeys);
    };

    fetchSemesters();
  }, []);

  /**
   * Fetches and sets courses based on selectedSemester and userEmail.
   */
  useEffect(() => {
    if (selectedSemester) {
      const allCourses = offeredCoursesData[selectedSemester] || [];
      const userEmail = session?.user?.email || "";
      const filteredCourses = allCourses
        .filter(
          (course) =>
            course.Email &&
            course.Email.toLowerCase() === userEmail.toLowerCase(),
        )
        .map((course) => generateCourseFileName(course, selectedSemester));

      setCourses(filteredCourses);
      console.log(
        `📚 Filtered courses for semester ${selectedSemester} and email ${userEmail}:`,
        filteredCourses,
      );
    } else {
      setCourses([]);
    }
  }, [selectedSemester, session?.user?.email]);

  /**
   * Handles semester selection.
   *
   * @param {string} semester - The selected semester.
   */
  const handleSelectSemester = (semester) => {
    setSelectedSemester(semester);
    console.log(`🔄 Selected semester: ${semester}`);
    // Clearing selectedCourse and courseFileName is handled by the context
  };

  /**
   * Handles the "Show Courses" button click.
   * Currently, no additional action is required since courses are managed via useEffect.
   */
  const handleShowCourses = () => {
    if (!selectedSemester) {
      setErrorMessage("Please select a semester first.");
      return;
    }
    console.log(
      "📤 Show Courses button clicked for semester:",
      selectedSemester,
    );
    // No additional action needed
  };

  /**
   * Handles course selection.
   *
   * @param {string} course - The selected course file name.
   */
  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    console.log("🎯 Selected course:", course);
  };

  /**
   * Handles the "Show Course" button click.
   * Initiates the API call to create or fetch the course file data.
   */
  const handleShowCourse = async () => {
    if (!selectedCourse) {
      setErrorMessage("Please select a course first.");
      return;
    }

    const courseFileNameGenerated = selectedCourse;
    console.log(
      "🚀 Initiating API call for course file:",
      courseFileNameGenerated,
    );

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
          courseFileName: courseFileNameGenerated,
          userId: session?.user?.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCourseFileName(result.courseFile.courseFileName);
        setSuccessMessage("Course file created successfully!");
        console.log("✅ Course file created:", result.courseFile);
        await fetchCourseFileData(courseFileNameGenerated);
      } else if (response.status === 409) {
        // Conflict: Course file already exists
        console.warn(
          "⚠️ Course file already exists:",
          "Fetching existing course file.",
        );
        await fetchCourseFileData(courseFileNameGenerated);
      } else {
        // Other errors
        const errorResult = await response.json();
        console.error("❌ Error creating course file:", errorResult.error);
        setErrorMessage("Failed to create course file.");
      }
    } catch (error) {
      console.error("❌ Unexpected error during course file creation:", error);
      setErrorMessage(
        "An unexpected error occurred while creating the course file.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches course file data by name.
   *
   * @param {string} fileName - The name of the course file to fetch.
   */
  const fetchCourseFileData = async (fileName) => {
    try {
      const response = await fetch(
        `/api/course/user/viewCourseFileByName?courseFileName=${encodeURIComponent(
          fileName,
        )}`,
      );

      if (response.ok) {
        const result = await response.json();
        setTableData(result.courseFile);
        console.log("🔍 Fetched course file data:", result.courseFile);
      } else {
        console.error("❌ Error fetching course file data after creation.");
        setErrorMessage("Error fetching course file data after creation.");
      }
    } catch (error) {
      console.error("❌ Error fetching course file data:", error);
      setErrorMessage("An unexpected error occurred while fetching data.");
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

      <div className="bg-white dark:bg-gray-800 py-8 min-h-screen transition-colors duration-300">
        <div className="container mx-auto p-4">
          {/* Success Message */}
          {successMessage && (
            <p className="text-green-400 text-sm mb-4">{successMessage}</p>
          )}

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-400 text-sm mb-4">{errorMessage}</p>
          )}

          {/* Dropdown Fields and Buttons */}
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Semester Dropdown */}
            <div className="flex-1 min-w-[200px] relative">
              <SemesterDropdown
                semesters={semesters}
                selectedSemester={selectedSemester}
                onSelectSemester={handleSelectSemester}
              />
              {/* Dropdown Icon */}
              <svg
                className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Course Dropdown */}
            {courses.length > 0 && (
              <div className="flex-1 min-w-[200px] relative">
                <CourseDropdown
                  courses={courses}
                  selectedCourse={selectedCourse}
                  onSelectCourse={handleSelectCourse}
                />
                {/* Dropdown Icon */}
                <svg
                  className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {/* Show Courses Button */}
            <div className="flex-1 min-w-[200px]">
              <ShowCoursesButton
                onClick={handleShowCourses}
                disabled={!selectedSemester || loading}
              />
            </div>

            {/* Show Course Button */}
            {courses.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <ShowCourseButton
                  onClick={handleShowCourse}
                  disabled={!selectedCourse || loading}
                />
              </div>
            )}
          </div>

          {/* Display Message if No Courses Are Assigned */}
          {selectedSemester && courses.length === 0 && (
            <p className="text-red-400 text-sm text-center mb-4">
              No courses assigned for the selected semester. Please contact the
              administrator.
            </p>
          )}

          {/* Loading Indicator */}
          {(loading || isSearching) && (
            <div className="flex justify-center items-center mt-6">
              <Loader />
            </div>
          )}

          {/* Course File Table */}
          <div className="overflow-x-auto mt-4">
            {tableData ? (
              <CourseFileTable
                courseFileName={courseFileName}
                tableData={tableData}
                userId={session?.user?.id}
                setTableData={setTableData} // Pass the setTableData function
              />
            ) : (
              !loading &&
              !isSearching && (
                <p className="text-gray-400 text-sm text-center">
                  No course file data to display. Select a semester and course
                  to view course files.
                </p>
              )
            )}
          </div>

          {/* Review Modal */}
          {isReviewOpen && tableData && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setIsReviewOpen(false)}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-3xl shadow-lg"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Review Course Files
                  </h2>
                  <button
                    onClick={() => setIsReviewOpen(false)}
                    className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-bold"
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
                      <li
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span className="capitalize text-gray-800 dark:text-gray-200">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                            .trim()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tableData[key]
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
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
                          exam.marginal,
                      ).length;
                      const status =
                        completedExams === totalExams && totalExams > 0
                          ? "Completed"
                          : "Incomplete";
                      return (
                        <li
                          key={key}
                          className="flex justify-between items-center"
                        >
                          <span className="capitalize text-gray-800 dark:text-gray-200">
                            {label}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              status === "Completed"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
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
