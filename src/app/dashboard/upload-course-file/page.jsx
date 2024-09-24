// src/app/dashboard/upload-course-file/page.jsx

"use client";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import PlaceholderContent from "@/components/demo/placeholder-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import CourseFileForm from "./_components/CourseFileForm";
import FileUploadCard from "./_components/FileUploadCard"; // Use the card for each document
import Step1Dialog from "./_components/Step1Dialog"; // Dialog for step 1 (PDF)
import Step2Dialog from "./_components/Step2Dialog"; // Dialog for step 2 (Text)
import Step3Dialog from "./_components/Step3Dialog";

export default function CourseFilePage() {
  const [courseFileName, setCourseFileName] = useState("");
  const [isCourseCreated, setIsCourseCreated] = useState(false);
  const [currentDialog, setCurrentDialog] = useState(null); // To track which dialog is open

  // Check if the course name exists in localStorage
  useEffect(() => {
    const savedCourseFileName = localStorage.getItem("courseFileName");
    if (savedCourseFileName) {
      setCourseFileName(savedCourseFileName);
      setIsCourseCreated(true);
    }
  }, []);

  // Handle course file name submission
  const handleCourseFileSubmit = async (data) => {
    const res = await fetch("/api/course/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseFileName: data.courseFileName }),
    });

    if (res.ok) {
      setCourseFileName(data.courseFileName);
      setIsCourseCreated(true);
      localStorage.setItem("courseFileName", data.courseFileName);
    } else {
      console.error("Error creating course folder");
    }
  };

  // Handle "Continue to Current Course File" button click
  const handleContinueToUpload = () => {
    setIsCourseCreated(true); // Take the user back to the course file upload state
  };

  // Function to handle clearing the session and course file name
  const handleClearSession = () => {
    localStorage.removeItem("courseFileName");
    setCourseFileName("");
    setIsCourseCreated(false);
  };

  // Function to handle going back to the course file form (but keep the file name)
  const handleGoBack = () => {
    setIsCourseCreated(false); // Return to the course file name form
  };

  // Function to handle opening a specific dialog based on the step
  const openDialog = (step) => {
    setCurrentDialog(step);
  };

  // Function to close the currently open dialog
  const closeDialog = () => {
    setCurrentDialog(null);
  };

  return (
    <ContentLayout title="Upload Course File">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PlaceholderContent>
        <div className="container mx-auto p-4">
          {/* Display Header only if course is created */}
          {isCourseCreated && (
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                {/* Back Button */}
                <button
                  onClick={handleGoBack} // Go back to the course file name creation form
                  className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md"
                >
                  Back
                </button>

                {/* Display Course File Name */}
                <h2 className="text-sm font-semibold">
                  Course File: {courseFileName}
                </h2>
              </div>

              {/* Cancel / Clear Session Button */}
              <button
                onClick={handleClearSession}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Cancel Upload
              </button>
            </div>
          )}

          {/* Show form to create course file if it's not created */}
          {!isCourseCreated ? (
            <CourseFileForm
              onSubmit={handleCourseFileSubmit}
              defaultCourseFileName={courseFileName} // Pass course file name as prop
              showContinueButton={Boolean(courseFileName)} // Show the "Continue" button if a session exists
              onContinue={handleContinueToUpload} // Function to continue to the upload page
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Step 1 - Upload PDF */}
              <FileUploadCard
                courseFileName={courseFileName}
                label="1. Final grades of the students (Tabulation Sheet)"
                description="Upload PDF for Final Grades"
                onClick={() => openDialog("step1")} // Open Step 1 dialog
              />
              {/* Step 2 - Upload Text */}
              <FileUploadCard
                courseFileName={courseFileName}
                label="2. Summary of the OBE Sheet (Analysis of Grade Distribution, CO Attainment, PO Attainment, and CQI - plan for Course Improvement"
                description="Upload instructor feedback form as text"
                onClick={() => openDialog("step2")} // Open Step 2 dialog
              />

              {/* Step 3 - Course Outline Upload */}
              <FileUploadCard
                courseFileName={courseFileName}
                label="3. Instructor Feedback"
                description="Upload PDF or fill out form"
                onClick={() => openDialog("step3")} // Open Step 3 dialog
              />
            </div>
          )}
        </div>
      </PlaceholderContent>

      {/* Render Step 1 Dialog (PDF) */}
      {currentDialog === "step1" && (
        <Step1Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}

      {/* Render Step 2 Dialog (Text) */}
      {currentDialog === "step2" && (
        <Step2Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}

      {/* Render Step 3 Dialog (PDF or Form) */}
      {currentDialog === "step3" && <Step3Dialog courseFileName={courseFileName} closeDialog={closeDialog} />}
    </ContentLayout>
  );
}
