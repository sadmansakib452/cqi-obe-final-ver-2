// File: /courseFiles/_components/context/CourseFileContext.jsx

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { manageCourseFileState } from "../utils/manageCourseFileState";

// Create the context
const CourseFileContext = createContext();

// Custom hook to use the CourseFileContext
export const useCourseFile = () => {
  return useContext(CourseFileContext);
};

// Provider component
export const CourseFileProvider = ({ children }) => {
  const [state, setState] = useState(null); // Initialize state to null
  const [stateLoaded, setStateLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { loadState } = manageCourseFileState();

      // Load state from localStorage
      const { state: loadedState } = loadState();

      setState(
        loadedState || {
          selectedDepartment: "",
          selectedSemester: "",
          selectedCourse: "",
          courseFileName: "",
          tableData: null,
        },
      );

      setStateLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (stateLoaded && state && typeof window !== "undefined") {
      const { saveState } = manageCourseFileState();
      saveState(state);
    }
  }, [state, stateLoaded]);

  // If state is not loaded yet, don't render children
  if (!stateLoaded) {
    return null; // Or render a loading indicator
  }

  // Provide all states and setters to context consumers
  const value = {
    ...state,
    setSelectedDepartment: (value) =>
      setState((prev) => ({
        ...prev,
        selectedDepartment: value,
        // Reset child fields when parent changes
        selectedSemester: "",
        selectedCourse: "",
        courseFileName: "",
        tableData: null,
      })),
    setSelectedSemester: (value) =>
      setState((prev) => ({
        ...prev,
        selectedSemester: value,
        // Reset child fields when parent changes
        selectedCourse: "",
        courseFileName: "",
        tableData: null,
      })),
    setSelectedCourse: (value) =>
      setState((prev) => ({
        ...prev,
        selectedCourse: value,
        courseFileName: value,
        tableData: null, // Reset tableData when selectedCourse changes
      })),
    setCourseFileName: (value) =>
      setState((prev) => ({ ...prev, courseFileName: value })),
    setTableData: (value) =>
      setState((prev) => ({ ...prev, tableData: value })),
    stateLoaded,
  };

  return (
    <CourseFileContext.Provider value={value}>
      {children}
    </CourseFileContext.Provider>
  );
};

CourseFileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
