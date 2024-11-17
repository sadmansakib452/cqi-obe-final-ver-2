// File: /courseFiles/_components/forms/DynamicForm.jsx

"use client";

import React, { useEffect } from "react";
import { useCourseFile } from "../context/CourseFileContext";
import DepartmentDropdown from "../dropdowns/DepartmentDropdown";
import SemesterDropdown from "../dropdowns/SemesterDropdown";
import CourseDropdown from "../dropdowns/CourseDropdown";
import ErrorMessage from "../ui/ErrorMessage";
import SuccessMessage from "../ui/SuccessMessage";
import Loader from "../ui/Loader";
import {
  fetchOfferedCourses,
  fetchCoursesByDepartmentAndSemester,
} from "../services/courseService";
import { capitalizeFirstLetter } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

const DynamicForm = () => {

  const session = useSession()
  const userId = session?.data?.user?.id
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
    stateLoaded, // Add stateLoaded from context
  } = useCourseFile();

  // If state is not loaded yet, don't render the form
  if (!stateLoaded) {
    return null; // Or render a loading indicator
  }

  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState([]);
  const [semesters, setSemesters] = React.useState([]);
  const [courses, setCourses] = React.useState([]);

  /**
   * Fetch semesters based on selected department.
   */
  useEffect(() => {
    if (!stateLoaded) return; // Wait until state is loaded

    const initializeSemesters = async () => {
      if (selectedDepartment) {
        setLoading(true);
        setErrorMessage("");
        try {
          const data = await fetchOfferedCourses();
          const semesterKeys = Object.keys(data).filter((semesterKey) => {
            // Check if any course in the semester belongs to the selected department
            return data[semesterKey].some(
              (course) => course["Dedicated department"] === selectedDepartment,
            );
          });
          const formattedSemesters = semesterKeys.map((semesterKey) =>
            formatSemesterName(semesterKey),
          );
          setSemesters(formattedSemesters);
          setSuccessMessage([]);
        } catch (error) {
          console.error("❌ Error fetching semesters:", error);
          setErrorMessage("Failed to fetch semesters. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        // Reset semesters if department is not selected
        setSemesters([]);
      }
    };

    initializeSemesters();
  }, [selectedDepartment, stateLoaded]);

  /**
   * Fetch courses based on selected department and semester.
   */
  useEffect(() => {
    if (!stateLoaded) return; // Wait until state is loaded

    const initializeCourses = async () => {
      if (selectedDepartment && selectedSemester) {
        setLoading(true);
        setErrorMessage("");
        try {
          const fetchedCourses = await fetchCoursesByDepartmentAndSemester(
            selectedDepartment,
            selectedSemester,
          );
          setCourses(fetchedCourses);
          setSuccessMessage([]);
        } catch (error) {
          console.error("❌ Error fetching courses:", error);
          setErrorMessage("Failed to fetch courses. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        // Reset courses if semester is not selected
        setCourses([]);
      }
    };

    initializeCourses();
  }, [selectedDepartment, selectedSemester, stateLoaded]);

  /**
   * Handles form submission to generate and fetch course file data.
   */
  const handleSubmit = async () => {
    let errorMessages = [];
    if (!selectedDepartment) errorMessages.push("Department is required.");
    if (!selectedSemester) errorMessages.push("Semester is required.");
    if (!selectedCourse) errorMessages.push("Course is required.");

    if (errorMessages.length > 0) {
      setErrorMessage(errorMessages.join(" "));
      setSuccessMessage([]);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage([]);

    try {
      // Attempt API1: Fetch course file metadata
      const metadata = await fetchCourseFileData(selectedCourse);

      if (metadata) {
        // API1 succeeded, set the table data
        setCourseFileName(selectedCourse);
        setTableData(metadata);
        setSuccessMessage(["Course file data fetched successfully!"]);
      } else {
        // API1 returned no data, proceed to API2
        await createCourseFile(selectedCourse);
        // After creation, fetch the metadata again
        const newMetadata = await fetchCourseFileData(selectedCourse);
        if (newMetadata) {
          setCourseFileName(selectedCourse);
          setTableData(newMetadata);
          setSuccessMessage([
            "Course file created and data fetched successfully!",
          ]);
        } else {
          throw new Error("Failed to fetch course file data after creation.");
        }
      }

      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage([]);
      }, 3000);
    } catch (error) {
      console.error("❌ Error during form submission:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches course file data by name (API1).
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
   * Creates/upload a new course file (API2).
   *
   * @param {string} fileName - The name of the course file to create.
   * @returns {Promise<void>} Resolves when creation is successful.
   */
  const createCourseFile = async (fileName) => {
    try {
      const response = await fetch(
        `/api/course/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseFileName: fileName, userId }), // Adjust payload as needed
        },
      );

      if (!response.ok) {
        console.error("❌ Error creating course file.");
        throw new Error("Error creating course file.");
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * Formats semester names to display as "Fall-2024", "Spring-2023", etc.
   *
   * @param {string} semesterKey - The raw semester key from JSON (e.g., "fall-24").
   * @returns {string} The formatted semester name.
   */
  const formatSemesterName = (semesterKey) => {
    const [season, yearSuffix] = semesterKey.split("-");
    const year =
      parseInt(yearSuffix, 10) >= 50 ? `19${yearSuffix}` : `20${yearSuffix}`;
    return `${capitalizeFirstLetter(season)}-${year}`;
  };

  return (
    <div className="w-full bg-transparent">
      {/* Success Message */}
      {successMessage.length > 0 && (
        <SuccessMessage message={successMessage.join(" ")} />
      )}

      {/* Error Message */}
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {/* Form Fields with Framer Motion Animations */}
      <AnimatePresence>
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
            />
            {!selectedDepartment && errorMessage.includes("Department") && (
              <p className="text-red-500 text-sm mt-1">
                Please select a department.
              </p>
            )}
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
              />
              {!selectedSemester && errorMessage.includes("Semester") && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a semester.
                </p>
              )}
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
              />
              {!selectedCourse && errorMessage.includes("Course") && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a course.
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Show Button aligned below the form fields */}
      {selectedDepartment && selectedSemester && selectedCourse && (
        <AnimatePresence>
          <motion.div
            className="flex justify-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={!selectedCourse || loading}
              className="w-32 flex items-center justify-center"
              icon={!loading && <EyeOutlined />}
            >
              Show
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

      
    </div>
  );
};

export default DynamicForm;
