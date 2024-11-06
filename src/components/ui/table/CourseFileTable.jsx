// File: src/components/ui/table/CourseFileTable.jsx

import React, { useState, Fragment } from "react";
import {
  EyeIcon,
  ArrowPathIcon,
  TrashIcon,
  ChevronDownIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/solid";
import DocumentViewer from "@/components/DocumentViewer/DocumentViewer";
import { motion, AnimatePresence } from "framer-motion";
import useSignedUrl from "@/hooks/useSignedUrl";

/**
 * Renders a table displaying course files with options to view, upload, re-upload, and delete files.
 */
const CourseFileTable = ({ courseFileName, tableData }) => {
  // State variables
  const [expandedExamType, setExpandedExamType] = useState(null); // Currently expanded exam type
  const [isViewerOpen, setIsViewerOpen] = useState(false); // Controls the document viewer visibility
  const [currentViewerUrl, setCurrentViewerUrl] = useState(null); // URL for the iframe viewer
  const [currentDirectUrl, setCurrentDirectUrl] = useState(null); // Direct URL for download and print
  const [currentFileName, setCurrentFileName] = useState(""); // Name of the current file

  const { getSignedUrl, loading } = useSignedUrl();

  // If no table data is provided, display a message
  if (!tableData) return <p>No course file data to display.</p>;

  // Define the table rows based on the provided data
  const tableRows = [
    // Single file entries
    {
      item: "Final Grades",
      type: "single",
      status: tableData.finalGrades ? "Uploaded" : "Not Uploaded",
      path: tableData.finalGrades,
    },
    {
      item: "Summary of OBE",
      type: "single",
      status: tableData.summaryObe ? "Uploaded" : "Not Uploaded",
      path: tableData.summaryObe,
    },
    {
      item: "Instructor Feedback",
      type: "single",
      status: tableData.insFeedback ? "Uploaded" : "Not Uploaded",
      path: tableData.insFeedback,
    },
    {
      item: "Course Outline",
      type: "single",
      status: tableData.courseOutline ? "Uploaded" : "Not Uploaded",
      path: tableData.courseOutline,
    },
    {
      item: "List of Project Assignments",
      type: "single",
      status: tableData.assignment ? "Uploaded" : "Not Uploaded",
      path: tableData.assignment,
    },
    {
      item: "List of Lab Experiments",
      type: "single",
      status: tableData.labExperiment ? "Uploaded" : "Not Uploaded",
      path: tableData.labExperiment,
    },
    // Multiple file entries (exams)
    {
      item: "Mid Exam",
      type: "multiple",
      exams: tableData.midExams || [],
    },
    {
      item: "Quiz Exam",
      type: "multiple",
      exams: tableData.quizExams || [],
    },
    {
      item: "Final Exam",
      type: "multiple",
      exams: tableData.finalExam ? [tableData.finalExam] : [],
    },
  ];

  /**
   * Handles viewing a file by opening the document viewer.
   * Utilizes both viewerUrl (for iframe display) and directUrl (for download and print).
   *
   * @param {string} filePath - The path of the file in storage.
   * @param {string} fileName - The name of the file.
   */
  const handleViewFile = async (filePath, fileName) => {
    const response = await getSignedUrl(filePath);
    if (response && response.viewerUrl && response.directUrl) {
      setCurrentViewerUrl(response.viewerUrl);
      setCurrentDirectUrl(response.directUrl);
      setCurrentFileName(fileName || "Document");
      setIsViewerOpen(true);
    } else {
      alert("Unable to view the file at this time.");
    }
  };

  /**
   * Closes the document viewer and resets related state variables.
   */
  const closeViewer = () => {
    setIsViewerOpen(false);
    setCurrentViewerUrl(null);
    setCurrentDirectUrl(null);
    setCurrentFileName("");
  };

  // Placeholder functions for other actions
  const handleUpload = (item) =>
    alert(`Upload functionality for ${item} is not implemented yet.`);
  const handleReupload = (item) =>
    alert(`Re-upload functionality for ${item} is not implemented yet.`);
  const handleDelete = (item) =>
    alert(`Delete functionality for ${item} is not implemented yet.`);
  const handleUploadMore = (examType) =>
    alert(`Upload more functionality for ${examType} is not implemented yet.`);
  const handleUploadExamFile = (examType, index, fileType) =>
    alert(
      `Upload functionality for ${fileType} of ${examType} ${
        index + 1
      } is not implemented yet.`,
    );
  const handleDeleteExam = (examType, index) =>
    alert(
      `Delete functionality for ${examType} ${index + 1} is not implemented yet.`,
    );

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
   * Checks if a file is viewable based on its extension.
   *
   * @param {string} filePath - The path of the file.
   * @returns {boolean} - True if the file is viewable, else false.
   */
  const isViewable = (filePath) => {
    const viewableExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".svg",
      ".bmp",
    ];
    return viewableExtensions.some((ext) =>
      filePath.toLowerCase().endsWith(ext),
    );
  };

  /**
   * Capitalizes the first letter of a string.
   *
   * @param {string} str - The string to capitalize.
   * @returns {string} - The capitalized string.
   */
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  /**
   * Renders a table row for a single file item.
   *
   * @param {Object} row - The row data.
   * @param {number} index - The index of the row.
   * @returns {JSX.Element} - The table row element.
   */
  const renderSingleFileRow = (row, index) => (
    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
      {/* Item Name */}
      <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">
        {row.item}
      </td>
      {/* Status */}
      <td className="px-6 py-4 w-1/3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === "Uploaded"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      </td>
      {/* Actions */}
      <td className="px-6 py-4 text-sm text-gray-500 w-1/3">
        <div className="flex space-x-4">
          {row.path ? (
            <>
              {/* View Button */}
              {isViewable(row.path) && (
                <button
                  onClick={() => handleViewFile(row.path, row.item)}
                  className="text-gray-600 hover:text-blue-600"
                  title="View"
                  disabled={loading}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              )}
              {/* Re-upload Button */}
              <button
                onClick={() => handleReupload(row.item)}
                className="text-gray-600 hover:text-blue-600"
                title="Re-upload"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(row.item)}
                className="text-gray-600 hover:text-red-600"
                title="Delete"
                disabled
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          ) : (
            // Upload Button
            <button
              onClick={() => handleUpload(row.item)}
              className="text-gray-600 hover:text-blue-600"
              title="Upload"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  /**
   * Renders a table row for an exam item with expandable exams.
   *
   * @param {string} examType - The type of the exam (e.g., "Mid Exam").
   * @param {Array} exams - List of exams under this exam type.
   * @param {number} index - The index of the row.
   * @returns {JSX.Element} - The table row element.
   */
  const renderExamRow = (examType, exams, index) => {
    const status = getExamStatus(exams);
    const isExpanded = expandedExamType === examType;

    // Determine badge color based on status
    const badgeClass =
      status === "All Uploaded"
        ? "bg-green-100 text-green-800"
        : status === "Not Uploaded"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800";

    return (
      <Fragment key={index}>
        {/* Exam Type Row */}
        <tr className="bg-gray-50">
          {/* Exam Type Name */}
          <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">
            {examType}
          </td>
          {/* Status */}
          <td className="px-6 py-4 w-1/3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
            >
              {status}
            </span>
          </td>
          {/* Actions */}
          <td className="px-6 py-4 text-sm text-gray-500 w-1/3">
            <div className="flex space-x-4">
              {/* Expand/Collapse Button */}
              <button
                onClick={() =>
                  setExpandedExamType(isExpanded ? null : examType)
                }
                className="text-gray-600 hover:text-blue-600"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                <ChevronDownIcon
                  className={`h-5 w-5 transform transition-transform duration-300 ${
                    isExpanded ? "-rotate-180" : ""
                  }`}
                />
              </button>
              {/* Upload More Button */}
              <button
                onClick={() => handleUploadMore(examType)}
                className="text-gray-600 hover:text-blue-600"
                title="Upload"
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
              </button>
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
                className="bg-white"
              >
                {/* Exam Name */}
                <td className="px-6 py-4 pl-12 text-sm font-medium text-gray-900 w-1/3">
                  {examType} {idx + 1}
                </td>
                {/* Exam Status */}
                <td className="px-6 py-4 w-1/3">
                  {exam.question &&
                  exam.highest &&
                  exam.average &&
                  exam.marginal ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Uploaded
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Incomplete
                    </span>
                  )}
                </td>
                {/* Exam Actions */}
                <td className="px-6 py-4 text-sm text-gray-500 w-1/3">
                  <div className="flex space-x-2">
                    {["question", "highest", "average", "marginal"].map(
                      (fileType) => (
                        <button
                          key={fileType}
                          onClick={() =>
                            exam[fileType]
                              ? handleViewFile(
                                  exam[fileType],
                                  `${examType} ${idx + 1} - ${capitalize(
                                    fileType,
                                  )}`,
                                )
                              : handleUploadExamFile(examType, idx, fileType)
                          }
                          className="text-gray-600 hover:text-blue-600"
                          title={
                            exam[fileType]
                              ? `View ${capitalize(fileType)}`
                              : `Upload ${capitalize(fileType)}`
                          }
                          disabled={loading}
                        >
                          {exam[fileType] ? (
                            <EyeIcon className="h-5 w-5" />
                          ) : (
                            <ArrowUpTrayIcon className="h-5 w-5" />
                          )}
                        </button>
                      ),
                    )}
                    {/* Delete Exam Button */}
                    <button
                      onClick={() => handleDeleteExam(examType, idx)}
                      className="text-gray-600 hover:text-red-600"
                      title="Delete"
                      disabled
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
        </AnimatePresence>
      </Fragment>
    );
  };

  return (
    <div className="overflow-x-auto">
      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        {/* Table Header */}
        <thead className="bg-gray-200">
          <tr>
            <th
              colSpan="3"
              className="text-center px-6 py-3 text-gray-800 bg-gray-100 text-xl"
            >
              Course File: {courseFileName}
            </th>
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-gray-700 w-1/3">Item</th>
            <th className="px-6 py-3 text-left text-gray-700 w-1/3">Status</th>
            <th className="px-6 py-3 text-left text-gray-700 w-1/3">Action</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {tableRows.map((row, index) => {
            if (row.type === "single") {
              return renderSingleFileRow(row, index);
            } else if (row.type === "multiple") {
              return renderExamRow(row.item, row.exams, index);
            }
            return null;
          })}
        </tbody>
      </table>

      {/* Document Viewer Popup */}
      {isViewerOpen && currentViewerUrl && currentDirectUrl && (
        <DocumentViewer
          viewerUrl={currentViewerUrl}
          directUrl={currentDirectUrl}
          onClose={closeViewer}
          fileName={currentFileName}
        />
      )}
    </div>
  );
};

export default CourseFileTable;
