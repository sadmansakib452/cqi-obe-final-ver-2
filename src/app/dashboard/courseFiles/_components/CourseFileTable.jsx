// File: src/app/dashboard/courseFiles/_components/CourseFileTable.jsx

"use client";

import React, { useState } from "react";
import { DocumentChartBarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
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

// Import extracted subcomponents
import SingleFileRow from "./SingleFileRow";
import ExamRow from "./ExamRow";
import ReviewModal from "./ReviewModal";

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);



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
  const [isReviewOpen, setIsReviewOpen] = useState(false); // Controls the ReviewModal visibility

  const { getSignedUrl, loading } = useSignedUrl();

  // Debugging: Log tableData
  console.log("CourseFileTable - tableData:", tableData);

  // If no table data is provided, display a message
  if (!tableData)
    return (
      <p className="text-gray-900 dark:text-gray-100">
        No course file data to display.
      </p>
    );

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
    try {
      const response = await getSignedUrl(filePath);
      if (response && response.viewerUrl && response.directUrl) {
        setCurrentViewerUrl(response.viewerUrl);
        setCurrentDirectUrl(response.directUrl);
        setCurrentFileName(fileName || "Document");
        setIsViewerOpen(true);
      } else {
        alert("Unable to view the file at this time.");
      }
    } catch (error) {
      console.error("Error viewing file:", error);
      alert("An error occurred while trying to view the file.");
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
        `/api/course/user/viewCourseFileByName?courseFileName=${encodeURIComponent(fileName)}`,
      );

      if (response.ok) {
        const result = await response.json();
        setTableData(result.courseFile); // Update table data
      } else {
        console.error("Error fetching course file data after upload.");
        alert("Failed to fetch course file data.");
      }
    } catch (error) {
      console.error("Error fetching course file data:", error);
      alert("An error occurred while fetching course file data.");
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Review Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsReviewOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <DocumentChartBarIcon className="h-5 w-5" />
          <span>Review</span>
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
        {/* Table Header */}
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th
              colSpan="3"
              className="text-center px-6 py-3 text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 text-xl"
            >
              Course File: {courseFileName}
            </th>
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-200 w-1/3">
              Item
            </th>
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-200 w-1/3">
              Status
            </th>
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-200 w-1/3">
              Action
            </th>
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

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        tableData={tableData}
        handleViewFile={handleViewFile}
        loading={loading}
      />
    </div>
  );
};



export default CourseFileTable;
