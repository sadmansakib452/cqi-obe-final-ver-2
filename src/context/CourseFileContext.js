// File: /src/context/CourseFileContext.js

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

/**
 * Creates a Context for Course Files.
 */
const CourseFileContext = createContext();

/**
 * CourseFileProvider manages global state for course files.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The provider component.
 */
export function CourseFileProvider({ children }) {
  const { data: session, status } = useSession();

  const [courseFileName, setCourseFileName] = useState("");
  const [tableData, setTableData] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  /**
   * Initializes state from localStorage on component mount.
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCourseFileName = localStorage.getItem("courseFileName");
      const storedSelectedCourse = localStorage.getItem("selectedCourse");
      const storedSelectedSemester = localStorage.getItem("selectedSemester");
      const storedTableData = localStorage.getItem("tableData");

      if (storedSelectedSemester) setSelectedSemester(storedSelectedSemester);
      if (storedSelectedCourse) setSelectedCourse(storedSelectedCourse);
      if (storedCourseFileName) setCourseFileName(storedCourseFileName);
      if (storedTableData) setTableData(JSON.parse(storedTableData));
    }
  }, []);

  /**
   * Synchronizes selectedCourse with courseFileName and updates localStorage.
   */
  useEffect(() => {
    if (selectedCourse) {
      setCourseFileName(selectedCourse);
      localStorage.setItem("selectedCourse", selectedCourse);
      localStorage.setItem("courseFileName", selectedCourse);
    } else {
      setCourseFileName("");
      localStorage.removeItem("selectedCourse");
      localStorage.removeItem("courseFileName");
    }
  }, [selectedCourse]);

  /**
   * Persists selectedSemester, courseFileName, and tableData to localStorage.
   */
  useEffect(() => {
    if (selectedSemester) {
      localStorage.setItem("selectedSemester", selectedSemester);
    } else {
      localStorage.removeItem("selectedSemester");
    }

    if (courseFileName) {
      localStorage.setItem("courseFileName", courseFileName);
    } else {
      localStorage.removeItem("courseFileName");
    }

    if (tableData) {
      localStorage.setItem("tableData", JSON.stringify(tableData));
    } else {
      localStorage.removeItem("tableData");
    }
  }, [selectedSemester, courseFileName, tableData]);

  /**
   * Handles user logout by clearing relevant state and localStorage entries.
   */
  const logoutHandler = async () => {
    try {
      localStorage.removeItem("tableData");
      localStorage.removeItem("courseFileName");
      localStorage.removeItem("selectedSemester");
      localStorage.removeItem("selectedCourse");
      setTableData(null);
      setCourseFileName("");
      setSelectedSemester("");
      setSelectedCourse("");
      await signOut({ redirect: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /**
   * Clears state and localStorage if the user becomes unauthenticated.
   */
  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem("tableData");
      localStorage.removeItem("courseFileName");
      localStorage.removeItem("selectedSemester");
      localStorage.removeItem("selectedCourse");
      setTableData(null);
      setCourseFileName("");
      setSelectedSemester("");
      setSelectedCourse("");
    }
  }, [status]);

  return (
    <CourseFileContext.Provider
      value={{
        courseFileName,
        setCourseFileName,
        tableData,
        setTableData,
        selectedSemester,
        setSelectedSemester,
        selectedCourse,
        setSelectedCourse,
        logoutHandler,
      }}
    >
      {children}
    </CourseFileContext.Provider>
  );
}

/**
 * Custom hook to access the CourseFileContext.
 *
 * @returns {Object} The context value.
 */
export function useCourseFile() {
  return useContext(CourseFileContext);
}
