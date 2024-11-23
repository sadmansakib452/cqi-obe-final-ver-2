// File: src/app/dashboard/courseFiles/_components/context/CourseFileContext.jsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { loadState, saveState } from "../utils/manageCourseFileState";

// Create the context
const CourseFileContext = createContext();

// Custom hook to use the CourseFileContext
export const useCourseFile = () => {
  return useContext(CourseFileContext);
};

// Provider component
export const CourseFileProvider = ({ children }) => {
  // Initialize state with default values
  const [state, setState] = useState({
    selectedDepartment: "",
    selectedSemester: "", // e.g., "Fall-2024"
    selectedCourse: "",
    courseFileName: "",
    tableData: null,
  });

  const [stateLoaded, setStateLoaded] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadedState = loadState();

      setState(
        loadedState || {
          selectedDepartment: "",
          selectedSemester: "", // e.g., "Fall-2024"
          selectedCourse: "",
          courseFileName: "",
          tableData: null,
        },
      );

      setStateLoaded(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (stateLoaded && state && typeof window !== "undefined") {
      saveState(state);
    }
  }, [state, stateLoaded]);

  // Stabilize setter functions using useCallback to prevent unnecessary re-renders
  const setSelectedDepartment = useCallback((value) => {
    setState((prev) => ({
      ...prev,
      selectedDepartment: value,
      // Reset child fields when parent changes
      selectedSemester: "",
      selectedCourse: "",
      courseFileName: "",
      tableData: null,
    }));
  }, []);

  const setSelectedSemester = useCallback((value) => {
    setState((prev) => ({
      ...prev,
      selectedSemester: value, // e.g., "Fall-2024"
      // Reset child fields when semester changes
      selectedCourse: "",
      courseFileName: "",
      tableData: null,
    }));
  }, []);

  const setSelectedCourse = useCallback((value) => {
    setState((prev) => ({
      ...prev,
      selectedCourse: value,
      courseFileName: value,
      tableData: null, // Reset tableData when selectedCourse changes
    }));
  }, []);

  const setCourseFileName = useCallback((value) => {
    setState((prev) => ({ ...prev, courseFileName: value }));
  }, []);

  const setTableData = useCallback((value) => {
    setState((prev) => ({ ...prev, tableData: value }));
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => {
    return {
      ...state,
      loading, // Expose loading state
      setLoading, // Expose setLoading function
      setSelectedDepartment,
      setSelectedSemester,
      setSelectedCourse,
      setCourseFileName,
      setTableData,
      stateLoaded,
    };
  }, [
    state,
    loading,
    setSelectedDepartment,
    setSelectedSemester,
    setSelectedCourse,
    setCourseFileName,
    setTableData,
    stateLoaded,
  ]);

  // All hooks are called above. Now, conditionally render children.
  return (
    <CourseFileContext.Provider value={value}>
      {stateLoaded ? children : null} {/* Or render a loading indicator */}
    </CourseFileContext.Provider>
  );
};

CourseFileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
