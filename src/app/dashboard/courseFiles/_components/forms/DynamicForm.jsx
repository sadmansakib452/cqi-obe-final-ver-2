// File: /courseFiles/_components/forms/DynamicForm.jsx

"use client";

import React, { useEffect } from "react";
import { useCourseFile } from "../context/CourseFileContext";
import DepartmentDropdown from "../dropdowns/DepartmentDropdown";
import SemesterDropdown from "../dropdowns/SemesterDropdown";
import CourseDropdown from "../dropdowns/CourseDropdown";
import { fetchCoursesByDepartmentAndSemester } from "../services/courseService";
import { capitalizeFirstLetter } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  notifyError,
  notifyWarning,
  notifyInfo,
} from "../ui/notifications/notify"; // Import notification functions
import { semesterOptions } from "../config/semesterOptions";

const DynamicForm = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const facultyEmail = session?.user?.email;

  const {
    selectedDepartment,
    setSelectedDepartment,
    selectedSemester,
    setSelectedSemester,
    selectedCourse,
    setSelectedCourse,
    courseFileName,
    setCourseFileName,
    setTableData,
    stateLoaded,
    loading,
    setLoading, // Ensure this is available in context
  } = useCourseFile();

  const [semesters, setSemesters] = React.useState([]);
  const [courses, setCourses] = React.useState([]);

  /**
   * Step 1: Initialize semesters based on a static list.
   * Populates the semester dropdown when a department is selected.
   */
  useEffect(() => {
    if (!stateLoaded) return; // Wait until state is loaded

    if (selectedDepartment) {
      setSemesters(semesterOptions);
    } else {
      setSemesters([]);
    }
  }, [selectedDepartment, stateLoaded]);

  /**
   * Step 2: Fetch courses based on selected department, semester, year, and faculty email.
   * Automatically triggered when selectedSemester changes.
   */
  useEffect(() => {
    if (!stateLoaded) return; // Wait until state is loaded

    const initializeCourses = async () => {
      if (selectedDepartment && selectedSemester && facultyEmail) {
        setLoading(true);
        try {
          const [semesterPart, yearPart] = selectedSemester.split("-"); // e.g., "Fall-2024" -> ["Fall", "2024"]

          // Validate semester and year parts
          if (!semesterPart || !yearPart) {
            throw new Error(
              "Invalid semester format. Expected format: 'Fall-2024'",
            );
          }

          // Fetch courses assigned to the faculty member
          const fetchedCourses = await fetchCoursesByDepartmentAndSemester(
            selectedDepartment,
            semesterPart,
            yearPart,
            facultyEmail,
          );

          console.log("Fetched Courses:", fetchedCourses);

          if (fetchedCourses.length === 0) {
            notifyInfo("No courses found for the selected criteria.");
          }

          setCourses(fetchedCourses);
        } catch (error) {
          console.error("❌ Error fetching courses:", error);
          notifyError(
            error.message || "Failed to fetch courses. Please try again later.",
          );
        } finally {
          setLoading(false);
        }
      } else {
        // Reset courses if semester or faculty email is not available
        setCourses([]);
      }
    };

    initializeCourses();
  }, [
    selectedDepartment,
    selectedSemester,
    facultyEmail,
    stateLoaded,
    setLoading,
  ]);

  /**
   * Step 3: Automatically trigger submission when a course is selected.
   */
  useEffect(() => {
    const handleAutoSubmit = async () => {
      if (selectedCourse) {
        setLoading(true);
        try {
          // Fetch course file data
          const metadata = await fetchCourseFileData(selectedCourse);

          if (metadata) {
            // API1 succeeded, set the table data
            setCourseFileName(selectedCourse);
            setTableData(metadata);
            notifyInfo("Course file data fetched successfully!");
          } else {
            // API1 returned no data, proceed to API2
            await createCourseFile(selectedCourse);
            // After creation, fetch the metadata again
            const newMetadata = await fetchCourseFileData(selectedCourse);
            if (newMetadata) {
              setCourseFileName(selectedCourse);
              setTableData(newMetadata);
              notifyInfo("Course file created and data fetched successfully!");
            } else {
              throw new Error(
                "Failed to fetch course file data after creation.",
              );
            }
          }
        } catch (error) {
          console.error("❌ Error during automatic submission:", error);
          notifyError(error.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      }
    };

    handleAutoSubmit();
  }, [selectedCourse, setLoading, setCourseFileName, setTableData]);

  /**
   * Step 4: Fetches course file data by name (API1).
   *
   * @param {string} fileName - The name of the course file to fetch.
   * @returns {Promise<Object|null>} The fetched course file data or null if not found.
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
        return result.courseFile;
      } else if (response.status === 404) {
        // Course file not found
        return null;
      } else {
        console.error("❌ Error fetching course file data.");
        throw new Error("Error fetching course file data.");
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * Step 5: Creates/upload a new course file (API2).
   *
   * @param {string} fileName - The name of the course file to create.
   * @returns {Promise<void>} Resolves when creation is successful.
   */
  const createCourseFile = async (fileName) => {
    try {
      const response = await fetch(`/api/course/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseFileName: fileName, userId }), // Adjust payload as needed
      });

      if (!response.ok) {
        console.error("❌ Error creating course file.");
        throw new Error("Error creating course file.");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="w-full bg-transparent">
      {/* Form Fields with Framer Motion Animations */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            className="flex flex-wrap justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Department Dropdown */}
            <motion.div
              className="w-full sm:w-1/2 md:w-1/4 p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <DepartmentDropdown
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
                disabled={loading}
              />
            </motion.div>

            {/* Semester Dropdown */}
            {selectedDepartment && (
              <motion.div
                className="w-full sm:w-1/2 md:w-1/4 p-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <SemesterDropdown
                  semesters={semesters}
                  selectedSemester={selectedSemester}
                  onSelectSemester={setSelectedSemester}
                  disabled={loading}
                />
              </motion.div>
            )}

            {/* Course Dropdown */}
            {selectedSemester && (
              <motion.div
                className="w-full sm:w-1/2 md:w-1/4 p-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <CourseDropdown
                  courses={courses}
                  selectedCourse={selectedCourse}
                  onSelectCourse={setSelectedCourse}
                  disabled={loading || courses.length === 0}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disable the form while loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Optional: Add a spinner or any loader if desired */}
            <div className="text-xl font-semibold text-gray-700">
              Loading...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DynamicForm;
