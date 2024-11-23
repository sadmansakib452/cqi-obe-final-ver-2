// File: /courseFiles/_components/config/semesterOptions.js

/**
 * @fileoverview Configuration file for semester options.
 */

const currentYear = new Date().getFullYear();

export const semesterOptions = [
  `Spring-${currentYear}`,
  `Summer-${currentYear}`,
  `Fall-${currentYear}`,
  `Spring-${currentYear + 1}`,
  `Summer-${currentYear + 1}`,
  `Fall-${currentYear + 1}`,
  // Add more years as needed
];
