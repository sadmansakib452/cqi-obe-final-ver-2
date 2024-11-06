// File: src/app/dashboard/courseFiles/_components/CourseFileTable.jsx

"use client";

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

// Import all StepXDialog components
import Step1Dialog from "./dialogs/Step1Dialog";
import Step2Dialog from "./dialogs/Step2Dialog";
import Step3Dialog from "./dialogs/Step3Dialog";
import Step4Dialog from "./dialogs/Step4Dialog";
import Step5Dialog from "./dialogs/Step5Dialog";
import Step6Dialog from "./dialogs/Step6Dialog";
import Step7Dialog from "./dialogs/Step7Dialog";
import Step8Dialog from "./dialogs/Step8Dialog";
import Step9Dialog from "./dialogs/Step9Dialog";

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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
  return viewableExtensions.some((ext) => filePath.toLowerCase().endsWith(ext));
};

/**
 * Renders a table row for a single file item.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.row - The row data.
 * @param {number} props.index - The index of the row.
 * @param {Function} props.handleViewFile - Function to handle viewing files.
 * @param {Function} props.openUploadDialog - Function to open upload dialogs.
 * @param {boolean} props.loading - Loading state.
 * @returns {JSX.Element} - The table row element.
 */
const SingleFileRow = ({
  row,
  index,
  handleViewFile,
  openUploadDialog,
  loading,
}) => (
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
              onClick={() => openUploadDialog(row.step)} // Only step is needed
              className="text-gray-600 hover:text-blue-600"
              title="Re-upload"
              disabled={loading}
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            {/* Delete Button */}
            <button
              onClick={() =>
                alert(
                  `Delete functionality for ${row.item} is not implemented yet.`,
                )
              }
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
            onClick={() => openUploadDialog(row.step)} // Only step is needed
            className="text-gray-600 hover:text-blue-600"
            title="Upload"
            disabled={loading}
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
 * @param {Object} props - Component props.
 * @param {string} props.examType - The type of the exam (e.g., "Mid Exam").
 * @param {Array} props.exams - List of exams under this exam type.
 * @param {number} props.index - The index of the row.
 * @param {Function} props.handleViewFile - Function to handle viewing files.
 * @param {Function} props.openUploadDialog - Function to open upload dialogs.
 * @param {Function} props.capitalize - Function to capitalize strings.
 * @param {string|null} props.expandedExamType - Currently expanded exam type.
 * @param {Function} props.setExpandedExamType - Function to set expanded exam type.
 * @param {boolean} props.loading - Loading state.
 * @returns {JSX.Element} - The table row element.
 */
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
      ? "bg-green-100 text-green-800"
      : status === "Not Uploaded"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800";

  // Determine if any files are uploaded
  const hasUploadedFiles = exams.some(
    (exam) => exam.question || exam.highest || exam.average || exam.marginal,
  );

  // Determine if all files are uploaded
  const allUploaded = status === "All Uploaded";

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
          <div className="flex space-x-4 items-center">
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setExpandedExamType(isExpanded ? null : examType)}
              className="text-gray-600 hover:text-blue-600"
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
              className="text-gray-600 hover:text-blue-600"
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
                  alert(
                    `Delete functionality for ${examType} is not implemented yet.`,
                  )
                }
                className="text-gray-600 hover:text-red-600"
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
                  {/* View Buttons for Each FileType */}
                  {["question", "highest", "average", "marginal"].map(
                    (fileType) => (
                      <button
                        key={fileType}
                        onClick={() => {
                          if (exam[fileType]) {
                            handleViewFile(
                              exam[fileType],
                              `${examType} ${idx + 1} - ${capitalize(fileType)}`,
                            );
                          }
                        }}
                        className="text-gray-600 hover:text-blue-600"
                        title={`View ${capitalize(fileType)}`}
                        disabled={!exam[fileType] || loading}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    ),
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
      </AnimatePresence>
    </Fragment>
  );
};

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
 * Renders the CourseFileTable component.
 *
 * @param {Object} props - Component props.
 * @param {string} props.courseFileName - The name of the course file.
 * @param {Object} props.tableData - The course file data.
 * @param {string} props.userId - The user ID.
 * @param {Function} props.setTableData - Function to update table data.
 * @returns {JSX.Element} - The CourseFileTable component.
 */
const CourseFileTable = ({
  courseFileName,
  tableData,
  userId,
  setTableData,
}) => {
  // State variables
  const [expandedExamType, setExpandedExamType] = useState(null); // Currently expanded exam type
  const [isViewerOpen, setIsViewerOpen] = useState(false); // Controls the document viewer visibility
  const [currentViewerUrl, setCurrentViewerUrl] = useState(null); // URL for the iframe viewer
  const [currentDirectUrl, setCurrentDirectUrl] = useState(null); // Direct URL for download and print
  const [currentFileName, setCurrentFileName] = useState(""); // Name of the current file
  const [currentDialog, setCurrentDialog] = useState(null); // Currently open StepXDialog { step }

  const { getSignedUrl, loading } = useSignedUrl();

  // Debugging: Log tableData
  console.log("CourseFileTable - tableData:", tableData);

  // If no table data is provided, display a message
  if (!tableData) return <p>No course file data to display.</p>;

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

  /**
   * Opens the corresponding StepXDialog.jsx based on the step.
   *
   * @param {string} step - The step identifier (e.g., "step1").
   */
  const openUploadDialog = (step) => {
    if (!step) {
      console.error("No step provided for upload dialog.");
      return;
    }
    setCurrentDialog({ step });
  };

  /**
   * Closes the currently open StepXDialog.jsx.
   */
  const closeUploadDialog = () => {
    setCurrentDialog(null);
  };

  /**
   * Renders the corresponding StepXDialog.jsx based on the currentDialog state.
   */
  const renderUploadDialog = () => {
    if (!currentDialog) return null;

    const { step } = currentDialog;

    const dialogProps = {
      courseFileName,
      closeDialog: closeUploadDialog,
      userId,
      refreshTable: fetchCourseFileData, // Function to refresh table data after upload
      onUploadSuccess: () => {
        // Optional: Add additional actions here, such as displaying a toast notification
        console.log(`Upload for ${step} successful.`);
      },
    };

    switch (step) {
      case "step1":
        return <Step1Dialog {...dialogProps} />;
      case "step2":
        return <Step2Dialog {...dialogProps} />;
      case "step3":
        return <Step3Dialog {...dialogProps} />;
      case "step4":
        return <Step4Dialog {...dialogProps} />;
      case "step5":
        return <Step5Dialog {...dialogProps} />;
      case "step6":
        return <Step6Dialog {...dialogProps} />;
      case "step7":
        return <Step7Dialog {...dialogProps} />;
      case "step8":
        return <Step8Dialog {...dialogProps} />;
      case "step9":
        return <Step9Dialog {...dialogProps} />;
      default:
        return null;
    }
  };

  /**
   * Refreshes the course file data by fetching it from the backend.
   *
   * @param {string} fileName - The name of the course file to fetch.
   */
  const fetchCourseFileData = async (fileName) => {
    try {
      const response = await fetch(
        `/api/course/user/viewCourseFileByName?courseFileName=${fileName}`,
      );

      if (response.ok) {
        const result = await response.json();
        setTableData(result.courseFile); // Update table data
      } else {
        console.error("Error fetching course file data after upload.");
      }
    } catch (error) {
      console.error("Error fetching course file data:", error);
    }
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
              return (
                <SingleFileRow
                  key={index}
                  row={row}
                  index={index}
                  handleViewFile={handleViewFile}
                  openUploadDialog={openUploadDialog}
                  loading={loading}
                />
              );
            } else if (row.type === "multiple") {
              return (
                <ExamRow
                  key={index}
                  examType={row.item}
                  exams={row.exams}
                  index={index}
                  handleViewFile={handleViewFile}
                  openUploadDialog={openUploadDialog}
                  capitalize={capitalize}
                  expandedExamType={expandedExamType}
                  setExpandedExamType={setExpandedExamType}
                  loading={loading}
                />
              );
            }
            return null;
          })}
        </tbody>
      </table>

      {/* Render Upload Dialogs */}
      {renderUploadDialog()}

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
