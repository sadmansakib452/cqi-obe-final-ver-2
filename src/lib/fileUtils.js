// src/lib/fileUtils.js

// Function to generate the unique filename
export function generateFileName({
  year,
  semester,
  courseCode,
  section,
  fileType,
}) {
  return `${year}.${semester}.${courseCode}-${section}.${fileType}.pdf`;
}

// Example usage:
// const fileName = generateFileName({
//   year: 2024,
//   semester: 1,
//   courseCode: "CSE487",
//   section: 3,
//   fileType: "OBE-SUMMARY"
// });
// => "2024.1.CSE487-3.OBE-SUMMARY.pdf"
