// File: /src/app/courseFiles/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Table from "@/components/ui/table/Table";
import Modal from "@/components/ui/modal/Modal";
import Spinner from "@/components/ui/Spinner"; // Custom Spinner import
import { fetchDynamicCourseFileNames, handleViewFile } from "@/lib/utils";

export default function CourseFilesViewPage() {
  const [courseFiles, setCourseFiles] = useState([]);
  const [columns, setColumns] = useState([{ key: "item", label: "Item" }]);
  const [tableLoading, setTableLoading] = useState(false); // Table-specific loading state
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal
  const [modalExamFiles, setModalExamFiles] = useState([]); // Data for modal

  // Function to fetch course files from the API
  const fetchCourseFiles = async () => {
    setTableLoading(true); // Start table loading spinner
    try {
      const response = await fetch("/api/course/user/viewCourseFiles");
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setCourseFiles(data.courseFiles || []);

      // Dynamically generate columns based on the course file names
      const dynamicCourseFileNames = fetchDynamicCourseFileNames(
        data.courseFiles,
      );
      setColumns([{ key: "item", label: "Item" }, ...dynamicCourseFileNames]);

      setTableLoading(false); // Stop table loading spinner
    } catch (err) {
      setError(err.message);
      setTableLoading(false); // Stop spinner in case of error
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchCourseFiles();
  }, []);

  // Handle error rendering
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Dynamically construct table data for all course files
  const tableData = [
    {
      item: "Final Grades",
      ...courseFiles.reduce((acc, file) => {
        acc[file.courseFileName] = file.finalGrades
          ? {
              isLink: true,
              label: "View File",
              action: () => handleViewFile(file.finalGrades),
            }
          : "Not Uploaded";
        return acc;
      }, {}),
    },
    {
      item: "Summary of OBE",
      ...courseFiles.reduce((acc, file) => {
        acc[file.courseFileName] = file.summaryObe
          ? {
              isLink: true,
              label: "View File",
              action: () => handleViewFile(file.summaryObe),
            }
          : "Not Uploaded";
        return acc;
      }, {}),
    },
    {
      item: "Instructor Feedback",
      ...courseFiles.reduce((acc, file) => {
        acc[file.courseFileName] = file.insFeedback
          ? {
              isLink: true,
              label: "View File",
              action: () => handleViewFile(file.insFeedback),
            }
          : "Not Uploaded";
        return acc;
      }, {}),
    },
    {
      item: "Course Outline",
      ...courseFiles.reduce((acc, file) => {
        acc[file.courseFileName] = file.courseOutline
          ? {
              isLink: true,
              label: "View File",
              action: () => handleViewFile(file.courseOutline),
            }
          : "Not Uploaded";
        return acc;
      }, {}),
    },
    {
      item: "Mid Exam",
      ...courseFiles.reduce((acc, file) => {
        acc[file.courseFileName] =
          file.midExams && file.midExams.length
            ? {
                isLink: true,
                label: `View File (${file.midExams.length})`,
                action: () => {
                  setModalExamFiles(file.midExams);
                  setModalOpen(true); // Open modal with mid exam data
                },
              }
            : "Not Uploaded";
        return acc;
      }, {}),
    },
    {
      item: "Quiz Exam",
      ...courseFiles.reduce((acc, file) => {
        acc[file.courseFileName] =
          file.quizExams && file.quizExams.length
            ? {
                isLink: true,
                label: `View File (${file.quizExams.length})`,
                action: () => {
                  setModalExamFiles(file.quizExams);
                  setModalOpen(true); // Open modal with quiz exam data
                },
              }
            : "Not Uploaded";
        return acc;
      }, {}),
    },
    {
      item: "Final Exam",
      ...courseFiles.reduce((acc, file) => {
        acc[file.courseFileName] = file.finalExam
          ? {
              isLink: true,
              label: "View File",
              action: () => {
                setModalExamFiles(file.finalExam);
                setModalOpen(true); // Open modal with final exam data
              },
            }
          : "Not Uploaded";
        return acc;
      }, {}),
    },
    {
      item: "List of Project Assignments",
      ...courseFiles.reduce((acc, file) => {
        acc[file.courseFileName] = "Not Uploaded";
        return acc;
      }, {}),
    },
    {
      item: "List of Lab Experiments",
      ...courseFiles.reduce((acc, file) => {
        acc[file.courseFileName] = file.labExperiment
          ? {
              isLink: true,
              label: "View Lab Experiment",
              action: () => handleViewFile(file.labExperiment),
            }
          : "Not Uploaded";
        return acc;
      }, {}),
    },
  ];

  return (
    <ContentLayout title="Course Files">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Course Files</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mt-6">
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-white mb-4">
          Uploaded Course Files
        </h2>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition"
          onClick={fetchCourseFiles}
        >
          Refresh Table
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        {tableLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner /> {/* Spinner component centered while loading */}
          </div>
        ) : (
          <Table columns={columns} data={tableData} />
        )}
      </div>

      {/* Modal for showing exam files */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Exam Files"
        examFiles={modalExamFiles}
      />
    </ContentLayout>
  );
}
