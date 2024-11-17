// File: /_components/tables/CourseFileTable.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * Renders a table displaying course file data.
 *
 * @param {Object} props - Component props.
 * @param {string} props.courseFileName - The name of the course file.
 * @param {Object} props.tableData - The data associated with the course file.
 * @param {string} props.userId - The ID of the user.
 * @param {Function} props.setTableData - Function to update table data.
 * @returns {JSX.Element} The CourseFileTable component.
 */
const CourseFileTable = ({
  courseFileName,
  tableData,
  userId,
  setTableData,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Course File: {courseFileName}
      </h2>
      <table className="min-w-full bg-white dark:bg-gray-700">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Field
            </th>
            <th className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(tableData).map((key) => (
            <tr key={key}>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                {formatFieldName(key)}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                {renderStatus(tableData[key])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Formats the field name for display.
 *
 * @param {string} field - The field name to format.
 * @returns {string} - The formatted field name.
 */
const formatFieldName = (field) => {
  // Replace camelCase or snake_case with spaces and capitalize words
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

/**
 * Renders the status based on the field's value.
 *
 * @param {any} value - The value of the field.
 * @returns {JSX.Element|string} - The status element or string.
 */
const renderStatus = (value) => {
  if (Array.isArray(value)) {
    // Handle arrays (e.g., exams)
    const completedExams = value.filter(
      (exam) => exam.question && exam.highest && exam.average && exam.marginal,
    ).length;
    const totalExams = value.length;
    const status =
      completedExams === totalExams && totalExams > 0
        ? "Completed"
        : "Incomplete";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === "Completed"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {status}
      </span>
    );
  } else if (typeof value === "boolean") {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {value ? "Uploaded" : "Not Uploaded"}
      </span>
    );
  } else {
    return value;
  }
};

CourseFileTable.propTypes = {
  courseFileName: PropTypes.string.isRequired,
  tableData: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  setTableData: PropTypes.func.isRequired,
};

export default CourseFileTable;
