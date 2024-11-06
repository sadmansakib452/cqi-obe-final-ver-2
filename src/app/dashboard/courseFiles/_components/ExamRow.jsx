// File: src/app/dashboard/courseFiles/_components/ExamRow.jsx

"use client";

import React, { Fragment } from "react";
import { EyeIcon, TrashIcon, ChevronDownIcon, ArrowPathIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Calculates the status of exams based on the number of completed uploads.
 *
 * @param {Array} exams - List of exam files.
 * @returns {string} - Status message.
 */
const getExamStatus = (exams) => {
  const totalExams = exams.length;
  if (totalExams === 0) return "Not Uploaded";

  const completedExams = exams.filter(
    (exam) =>
      exam.question && exam.highest && exam.average && exam.marginal
  ).length;

  if (completedExams === totalExams) return "All Uploaded";
  return `${completedExams} of ${totalExams} Uploaded`;
};

/**
 * Renders a table row for an exam item with expandable exams.
 *
 * @param {Object} props - Component props.
 * @param {string} props.examType - The type of the exam (e.g., "Mid Exam").
 * @param {Array} props.exams - List of exams under this exam type.
 * @param {number} props.index - The index of the row.
 * @param {Function} props.handleViewFile - Function to handle viewing files.
 * @param {Function} props.openUploadDialog - Function to open upload dialogs.
 * @param {string} props.capitalize - Function to capitalize strings.
 * @param {string|null} props.expandedExamType - Currently expanded exam type.
 * @param {Function} props.setExpandedExamType - Function to set expanded exam type.
 * @param {boolean} props.loading - Loading state.
 * @returns {JSX.Element} - The table row element.
 * 
 * 
 */


/**
 * Determines the corresponding step based on the exam type.
 *
 * @param {string} examType - The type of the exam (e.g., "Mid Exam").
 * @returns {string|null} - The corresponding step identifier or null if undefined.
 */
const getStepForExam = (examType) => {
  switch (examType) {
    case "Mid Exam":
      return "step5";
    case "Quiz Exam":
      return "step6";
    case "Final Exam":
      return "step7";
    default:
      return null;
  }
};

const ExamRow = ({
  examType,
  exams,
  index,
  handleViewFile,
  openUploadDialog,
  capitalize,
  expandedExamType,
  setExpandedExamType,
  loading,
}) => {
  const status = getExamStatus(exams);
  const isExpanded = expandedExamType === examType;

  // Determine badge color based on status
  const badgeClass =
    status === "All Uploaded"
      ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
      : status === "Not Uploaded"
      ? "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200"
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200";

  // Determine if any files are uploaded
  const hasUploadedFiles = exams.some(
    (exam) =>
      exam.question || exam.highest || exam.average || exam.marginal
  );

  // Determine if all files are uploaded
  const allUploaded = status === "All Uploaded";

  return (
    <Fragment>
      {/* Exam Type Row */}
      <tr
        className={`${
          index % 2 === 0
            ? "bg-gray-50 dark:bg-gray-800"
            : "bg-white dark:bg-gray-700"
        }`}
      >
        {/* Exam Type Name */}
        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 w-1/3">
          {examType}
        </td>
        {/* Status */}
        <td className="px-6 py-4 w-1/3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
            {status}
          </span>
        </td>
        {/* Actions */}
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 w-1/3">
          <div className="flex space-x-4 items-center">
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setExpandedExamType(isExpanded ? null : examType)}
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <ChevronDownIcon
                className={`h-5 w-5 transform transition-transform duration-300 ${
                  isExpanded ? "-rotate-180" : ""
                }`}
              />
            </button>
            {/* Upload/Reupload Button */}
            <button
              onClick={() => openUploadDialog(getStepForExam(examType))}
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              title={allUploaded ? "Re-upload" : "Upload"}
              disabled={loading}
            >
              {allUploaded ? (
                <ArrowPathIcon className="h-5 w-5" />
              ) : (
                <ArrowUpTrayIcon className="h-5 w-5" />
              )}
            </button>
            {/* Conditionally Render Delete Button */}
            {hasUploadedFiles && (
              <button
                onClick={() =>
                  alert(`Delete functionality for ${examType} is not implemented yet.`)
                }
                className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                title="Delete"
                disabled
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </td>
      </tr>
      {/* Expanded Exam Rows with Animation */}
      <AnimatePresence>
        {isExpanded &&
          exams.map((exam, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-700"
            >
              {/* Exam Name */}
              <td className="px-6 py-4 pl-12 text-sm font-medium text-gray-900 dark:text-gray-100 w-1/3">
                {examType} {idx + 1}
              </td>
              {/* Exam Status */}
              <td className="px-6 py-4 w-1/3">
                {exam.question && exam.highest && exam.average && exam.marginal ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200">
                    Uploaded
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200">
                    Incomplete
                  </span>
                )}
              </td>
              {/* Exam Actions */}
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 w-1/3">
                <div className="flex space-x-2">
                  {/* View Buttons for Each FileType */}
                  {["question", "highest", "average", "marginal"].map((fileType) => (
                    <button
                      key={fileType}
                      onClick={() => {
                        if (exam[fileType]) {
                          handleViewFile(
                            exam[fileType],
                            `${examType} ${idx + 1} - ${capitalize(fileType)}`
                          );
                        }
                      }}
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      title={`View ${capitalize(fileType)}`}
                      disabled={!exam[fileType] || loading}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </td>
            </motion.tr>
          ))}
      </AnimatePresence>
    
    </Fragment>
  )

// PropTypes for type checking
ExamRow.propTypes = {
  examType: PropTypes.string.isRequired,
  exams: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string,
      highest: PropTypes.string,
      average: PropTypes.string,
      marginal: PropTypes.string,
    })
  ).isRequired,
  index: PropTypes.number.isRequired,
  handleViewFile: PropTypes.func.isRequired,
  openUploadDialog: PropTypes.func.isRequired,
  capitalize: PropTypes.func.isRequired,
  expandedExamType: PropTypes.string,
  setExpandedExamType: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
}

export default ExamRow
