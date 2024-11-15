// File: /courseFiles/_components/utils.js

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generates the course file name based on the naming convention.
 * Format: YYYY.SemesterNumber.CourseCode-Section (e.g., "2024.3.CSE101-1")
 *
 * @param {Object} course - The course object containing course details.
 * @param {string} semester - The semester string (e.g., "fall-24").
 * @returns {string} - The formatted course file name.
 */
export const generateCourseFileName = (course, semester) => {
  const semesterMapping = {
    spring: 1,
    summer: 2,
    fall: 3,
  };

  const [semesterName, yearSuffix] = semester.split("-");
  const year = `20${yearSuffix}`; // Assuming year is in "YY" format
  const semesterNumber = semesterMapping[semesterName.toLowerCase()] || 0;

  if (semesterNumber === 0) {
    console.warn(`Invalid semester name: ${semesterName}`);
    return `${year}.0.${course.Course}-${course.Section}`;
  }

  return `${year}.${semesterNumber}.${course.Course}-${course.Section}`;
};
