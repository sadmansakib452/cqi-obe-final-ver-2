// File: /courseFiles/_components/utils/semesterUtils.js

/**
 * @fileoverview Utility functions for mapping semester names to numerical values and vice versa.
 */

/**
 * Maps semester names to their corresponding numerical values.
 *
 * @param {string} semester - The semester name (e.g., "Fall").
 * @returns {number} The numerical representation of the semester.
 */
export const getSemesterNumber = (semester) => {
  const mapping = {
    Spring: 1,
    Summer: 2,
    Fall: 3,
  };
  return mapping[semester] || 0; // Returns 0 if semester is invalid
};

/**
 * Maps semester numbers back to their corresponding names.
 *
 * @param {number} semesterNumber - The numerical representation of the semester.
 * @returns {string} The semester name (e.g., "Fall").
 */
export const getSemesterName = (semesterNumber) => {
  const mapping = {
    1: "Spring",
    2: "Summer",
    3: "Fall",
  };
  return mapping[semesterNumber] || "Unknown";
};
