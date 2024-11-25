// File: /courseFiles/_components/services/courseService.js

/**
 * @fileoverview Service module for fetching and processing course data.
 * Handles integration with the offered courses API and manages data processing.
 * Designed for a dynamic, API-driven approach without static data dependencies.
 */

import { getSemesterNumber } from "../utils/semesterUtils";

/**
 * Configuration flag to toggle between API and static data.
 * Set to true to use API, false to use static data.
 * Since static data is being deprecated, set to true.
 */
const useAPI = true;

/**
 * Base URL for the File Service API.
 * Should be defined in environment variables for flexibility.
 * Example: FILE_SERVICE_API_URL=http://127.0.0.1:8000
 */
const FILE_SERVICE_API_URL =
  process.env.FILE_SERVICE_API_URL || "http://127.0.0.1:8000";

/**
 * Fetches offered courses based on department, semester, and year.
 *
 * @param {string} department - The selected department (e.g., "CSE").
 * @param {string} semester - The selected semester name (e.g., "Fall").
 * @param {string} year - The selected year (e.g., "2024").
 * @returns {Promise<Object|null>} A promise that resolves to the offered courses data or null.
 */
export const fetchOfferedCourses = async (department, semester, year) => {
  if (!useAPI) {
    console.warn("API usage is disabled.");
    return null;
  }

  const semesterNumber = getSemesterNumber(semester);

  if (semesterNumber === 0) {
    console.error("Invalid semester provided.");
    return null;
  }

  const apiUrl = `${FILE_SERVICE_API_URL}/offeredCourses?department=${encodeURIComponent(
    department,
  )}&semester=${semesterNumber}&year=${encodeURIComponent(year)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error("Network response was not ok:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return null;
  }
};

/**
 * Fetches courses based on department, semester, year, and faculty email.
 *
 * @param {string} department - The selected department.
 * @param {string} semester - The selected semester name.
 * @param {string} year - The selected year.
 * @param {string} facultyEmail - The logged-in faculty's email.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of unique course file names.
 */
export const fetchCoursesByDepartmentAndSemester = async (
  department,
  semester,
  year,
  facultyEmail,
) => {
  try {
    const data = await fetchOfferedCourses(department, semester, year);

    if (!data || !data.courses) {
      return [];
    }

    // Filter courses assigned to the faculty member
    const filteredCourses = data.courses.filter(
      (course) => course.email === facultyEmail,
    );
    console.log("filteredCourses data", filteredCourses, facultyEmail);

    // Remove exact duplicates based on course_code and section
    const uniqueCourses = removeDuplicateCourses(filteredCourses);

    // Generate course file names
    const courseFileNames = uniqueCourses.map((course) =>
      generateCourseFileName(course, semester, year),
    );

    return courseFileNames;
  } catch (error) {
    console.error("Error in fetchCoursesByDepartmentAndSemester:", error);
    throw error;
  }
};

/**
 * Removes duplicate courses based on course_code and section.
 *
 * @param {Array<Object>} courses - Array of course objects.
 * @returns {Array<Object>} Array of unique course objects.
 */
const removeDuplicateCourses = (courses) => {
  const seen = {}; // Using an object to track seen identifiers
  const uniqueCourses = [];

  courses.forEach((course) => {
    const identifier = `${course.course_code}-${course.section}`;
    if (!seen[identifier]) {
      seen[identifier] = true;
      uniqueCourses.push(course);
    }
  });

  return uniqueCourses;
};

/**
 * Generates a course file name based on course details, semester, and year.
 *
 * @param {Object} course - The course object.
 * @param {string} semester - The semester string (e.g., "Fall").
 * @param {string} year - The year string (e.g., "2024").
 * @returns {string} The generated course file name.
 */
export const generateCourseFileName = (course, semester, year) => {
  const semesterNumber = getSemesterNumber(semester);

  // Ensure section is a number
  const sectionNumber = Number.isInteger(course.section)
    ? course.section
    : parseInt(course.section, 10);

  // Handle NaN sectionNumber
  if (isNaN(sectionNumber)) {
    console.warn(
      `Invalid section number for course ${course.course_code}. Defaulting to 0.`,
    );
    return `${year}.${semesterNumber}.${course.course_code}-0`;
  }

  const courseFileName = `${year}.${semesterNumber}.${course.course_code}-${sectionNumber}`;

  return courseFileName;
};
