/**
 * @fileoverview Configuration file for semester options.
 */

const currentYear = new Date().getFullYear();

/**
 * Array of semester options for the current year.
 * Example: ["Spring-2024", "Summer-2024", "Fall-2024"]
 */
const semesterOptions = [
  `Spring-${currentYear}`,
  `Summer-${currentYear}`,
  `Fall-${currentYear}`,
  // Removed future year semesters
  // `Spring-${currentYear + 1}`,
  // `Summer-${currentYear + 1}`,
  // `Fall-${currentYear + 1}`,
  // Add more years as needed
];

/**
 * Defines the hierarchy of semesters for sorting.
 * Higher numbers have higher priority.
 */
const semesterHierarchy = {
  Fall: 3,
  Summer: 2,
  Spring: 1,
};

/**
 * Sorts the semesterOptions array in descending order.
 * First by year (descending), then by semester within the same year (Fall > Summer > Spring).
 */
const sortedSemesterOptions = semesterOptions.sort((a, b) => {
  // Split the semester strings into [Season, Year]
  const [seasonA, yearA] = a.split("-");
  const [seasonB, yearB] = b.split("-");

  // Convert year strings to numbers for accurate comparison
  const numericYearA = parseInt(yearA, 10);
  const numericYearB = parseInt(yearB, 10);

  // Primary Sort: Year descending
  if (numericYearA !== numericYearB) {
    return numericYearB - numericYearA;
  }

  // Secondary Sort: Semester descending within the same year
  return semesterHierarchy[seasonB] - semesterHierarchy[seasonA];
});

/**
 * Export the sorted semester options.
 */
export { sortedSemesterOptions as semesterOptions };
