// File: src/app/dashboard/courseFiles/_components/ReviewModal.jsx

"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

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
    (exam) => exam.question && exam.highest && exam.average && exam.marginal,
  ).length;

  if (completedExams === totalExams) return "All Uploaded";
  return `${completedExams} of ${totalExams} Uploaded`;
};

/**
 * Renders the ReviewModal component.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Modal visibility state.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Object} props.tableData - The course file data.
 * @param {Function} props.handleViewFile - Function to handle viewing files.
 * @param {boolean} props.loading - Loading state.
 * @returns {JSX.Element|null} - The ReviewModal component.
 */
const ReviewModal = ({
  isOpen,
  onClose,
  tableData,
  handleViewFile,
  loading,
}) => {
  if (!isOpen) return null;

  // Define the table rows based on the provided data
  const tableRows = [
    // Single file entries
    {
      step: "step1",
      item: "Final Grades",
      type: "single",
      status: tableData.finalGrades ? "Uploaded" : "Not Uploaded",
      path: tableData.finalGrades,
    },
    {
      step: "step2",
      item: "Summary of OBE",
      type: "single",
      status: tableData.summaryObe ? "Uploaded" : "Not Uploaded",
      path: tableData.summaryObe,
    },
    {
      step: "step3",
      item: "Instructor Feedback",
      type: "single",
      status: tableData.insFeedback ? "Uploaded" : "Not Uploaded",
      path: tableData.insFeedback,
    },
    {
      step: "step4",
      item: "Course Outline",
      type: "single",
      status: tableData.courseOutline ? "Uploaded" : "Not Uploaded",
      path: tableData.courseOutline,
    },
    {
      step: "step8",
      item: "List of Project Assignments",
      type: "single",
      status: tableData.assignment ? "Uploaded" : "Not Uploaded",
      path: tableData.assignment,
    },
    {
      step: "step9",
      item: "List of Lab Experiments",
      type: "single",
      status: tableData.labExperiment ? "Uploaded" : "Not Uploaded",
      path: tableData.labExperiment,
    },
    // Multiple file entries (exams)
    {
      step: "step5",
      item: "Mid Exam",
      type: "multiple",
      exams: tableData.midExams || [],
    },
    {
      step: "step6",
      item: "Quiz Exam",
      type: "multiple",
      exams: tableData.quizExams || [],
    },
    {
      step: "step7",
      item: "Final Exam",
      type: "multiple",
      exams: tableData.finalExam ? [tableData.finalExam] : [],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Review Course Files
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200 w-1/3">
                  Item
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200 w-1/3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => {
                if (row.type === "single") {
                  return (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-700"
                          : "bg-white dark:bg-gray-800"
                      }`}
                    >
                      {/* Item Name */}
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 w-1/3">
                        {row.item}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-2 w-1/3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            row.status === "Uploaded"
                              ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                } else if (row.type === "multiple") {
                  return (
                    <React.Fragment key={index}>
                      <tr
                        className={`${
                          index % 2 === 0
                            ? "bg-gray-50 dark:bg-gray-700"
                            : "bg-white dark:bg-gray-800"
                        }`}
                      >
                        {/* Exam Type Name */}
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 w-1/3">
                          {row.item}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-2 w-1/3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getExamStatus(row.exams) === "All Uploaded"
                                ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
                                : getExamStatus(row.exams) === "Not Uploaded"
                                  ? "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
                            }`}
                          >
                            {getExamStatus(row.exams)}
                          </span>
                        </td>
                      </tr>
                      {/* Exam Details */}
                      {row.exams.map((exam, idx) => (
                        <tr
                          key={`${index}-${idx}`}
                          className={`${
                            idx % 2 === 0
                              ? "bg-gray-100 dark:bg-gray-600"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 w-1/3 pl-8">
                            {row.item} {idx + 1}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 w-1/3">
                            <ul className="list-disc list-inside">
                              <li>
                                Question:{" "}
                                {exam.question ? (
                                  <span className="text-green-800 dark:text-green-200">
                                    Uploaded
                                  </span>
                                ) : (
                                  <span className="text-yellow-800 dark:text-yellow-200">
                                    Incomplete
                                  </span>
                                )}
                              </li>
                              <li>
                                Highest:{" "}
                                {exam.highest ? (
                                  <span className="text-green-800 dark:text-green-200">
                                    Uploaded
                                  </span>
                                ) : (
                                  <span className="text-yellow-800 dark:text-yellow-200">
                                    Incomplete
                                  </span>
                                )}
                              </li>
                              <li>
                                Average:{" "}
                                {exam.average ? (
                                  <span className="text-green-800 dark:text-green-200">
                                    Uploaded
                                  </span>
                                ) : (
                                  <span className="text-yellow-800 dark:text-yellow-200">
                                    Incomplete
                                  </span>
                                )}
                              </li>
                              <li>
                                Marginal:{" "}
                                {exam.marginal ? (
                                  <span className="text-green-800 dark:text-green-200">
                                    Uploaded
                                  </span>
                                ) : (
                                  <span className="text-yellow-800 dark:text-yellow-200">
                                    Incomplete
                                  </span>
                                )}
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
ReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tableData: PropTypes.object.isRequired,
  handleViewFile: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ReviewModal;
