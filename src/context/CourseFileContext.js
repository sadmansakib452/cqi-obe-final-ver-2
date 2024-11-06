// File: /src/context/CourseFileContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const CourseFileContext = createContext();

export function CourseFileProvider({ children }) {
  const { data: session, status } = useSession();
  const [courseFileName, setCourseFileName] = useState("");
  const [tableData, setTableData] = useState(null);

  // Initialize state with localStorage values after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCourseFileName = localStorage.getItem("courseFileName");
      const storedTableData = localStorage.getItem("tableData");

      if (storedCourseFileName) setCourseFileName(storedCourseFileName);
      if (storedTableData) setTableData(JSON.parse(storedTableData));
    }
  }, []);

  // Update localStorage whenever courseFileName or tableData changes
  useEffect(() => {
    if (courseFileName) localStorage.setItem("courseFileName", courseFileName);
    if (tableData) localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [courseFileName, tableData]);

  // Explicit logout handler
  const logoutHandler = async () => {
    try {
      localStorage.removeItem("tableData");
      localStorage.removeItem("courseFileName");
      setTableData(null);
      setCourseFileName("");
      await signOut({ redirect: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Cleanup as a fallback when status is unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem("tableData");
      localStorage.removeItem("courseFileName");
      setTableData(null);
      setCourseFileName("");
    }
  }, [status]);

  return (
    <CourseFileContext.Provider
      value={{
        courseFileName,
        setCourseFileName,
        tableData,
        setTableData,
        logoutHandler,
      }}
    >
      {children}
    </CourseFileContext.Provider>
  );
}

export function useCourseFile() {
  return useContext(CourseFileContext);
}
