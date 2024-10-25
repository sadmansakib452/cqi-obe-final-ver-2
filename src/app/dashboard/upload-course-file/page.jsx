"use client";
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
import { useEffect, useState } from "react";
import CourseFileForm from "./_components/CourseFileForm";
import FileUploadCard from "./_components/FileUploadCard"; // File upload component
import Step1Dialog from "./_components/Step1Dialog";
import Step2Dialog from "./_components/Step2Dialog";
import Step3Dialog from "./_components/Step3Dialog";
import Step4Dialog from "./_components/Step4Dialog";
import Step5Dialog from "./_components/Step5Dialog";
import Step6Dialog from "./_components/Step6Dialog";
import Step7Dialog from "./_components/Step7Dialog";
import Step8Dialog from "./_components/Step8Dialog";
import Step9Dialog from "./_components/Step9Dialog";
import { useSession } from "next-auth/react"; // Session to get the userId

export default function CourseFilePage() {
  const session = useSession();
  const userId = session?.data?.user?.id; // Extract userId from session

  const [courseFileName, setCourseFileName] = useState("");
  const [isCourseCreated, setIsCourseCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState(""); // Add error state
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [currentDialog, setCurrentDialog] = useState(null); // Dialog state

  // Load saved course file name from localStorage if available
  useEffect(() => {
    const savedCourseFileName = localStorage.getItem("courseFileName");
    if (savedCourseFileName) {
      setCourseFileName(savedCourseFileName);
      setIsCourseCreated(true);
    }
  }, []);

  // Handle course file submission
  const handleCourseFileSubmit = async (data) => {
    setIsLoading(true); // Set loading state to true
    setErrorMessage(""); // Clear any previous errors

    try {
      // Make the API request to create the course file
      const res = await fetch("/api/course/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseFileName: data.courseFileName,
          userId, // Pass the userId with the course file name
        }),
      });

      if (res.ok) {
        // If successful, update the state and show success message
        setCourseFileName(data.courseFileName);
        setIsCourseCreated(true);
        localStorage.setItem("courseFileName", data.courseFileName);
        setSuccessMessage("Course file created successfully!");
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Error creating course file.");
      }
    } catch (error) {
      console.error("Error creating course file:", error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // Set loading state to false when done
    }
  };

  const handleContinueToUpload = () => {
    setIsCourseCreated(true);
  };

  const handleClearSession = () => {
    localStorage.removeItem("courseFileName");
    setCourseFileName("");
    setIsCourseCreated(false);
    setSuccessMessage(""); // Clear success message on reset
  };

  const handleGoBack = () => {
    setIsCourseCreated(false);
  };

  const openDialog = (step) => {
    setCurrentDialog(step);
  };

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

      <div className="bg-gray-50 dark:bg-zinc-900 py-8 min-h-screen transition-colors duration-300">
        <div className="container mx-auto p-4">
          {/* Display success message */}
          {successMessage && (
            <p className="text-green-500 text-sm mb-4">{successMessage}</p>
          )}

          {/* Display error message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          {isCourseCreated ? (
            <>
              {/* Course File Name */}
              <div className="text-left mb-6">
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Course File:{" "}
                  <span className="text-blue-700 dark:text-blue-300">
                    {courseFileName}
                  </span>
                </h2>
              </div>

              {/* Container for buttons */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handleGoBack}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Back
                </button>

                <button
                  onClick={handleClearSession}
                  className="bg-red-500 dark:bg-red-700 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 dark:hover:bg-red-800 transition"
                >
                  <i className="fas fa-times mr-2"></i> Cancel Upload
                </button>
              </div>

              {/* File Upload Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadCard
                  courseFileName={courseFileName}
                  label="1. Final grades of the students (Tabulation Sheet)"
                  description="Upload PDF for Final Grades"
                  onClick={() => openDialog("step1")}
                />
                <FileUploadCard
                  courseFileName={courseFileName}
                  label="2. Summary of the OBE Sheet"
                  description="Upload text for summary"
                  onClick={() => openDialog("step2")}
                />
                <FileUploadCard
                  courseFileName={courseFileName}
                  label="3. Instructor Feedback"
                  description="Upload PDF or fill out form"
                  onClick={() => openDialog("step3")}
                />
                <FileUploadCard
                  courseFileName={courseFileName}
                  label="4. Course Outline"
                  description="Upload PDF or fill out form"
                  onClick={() => openDialog("step4")}
                />
                <FileUploadCard
                  courseFileName={courseFileName}
                  label="5. Mid Exam Question and Answer Scripts"
                  description="Upload PDF or fill out form"
                  onClick={() => openDialog("step5")}
                />
                <FileUploadCard
                  courseFileName={courseFileName}
                  label="6. Quiz Exam Question and Answer Scripts"
                  description="Upload PDF or fill out form"
                  onClick={() => openDialog("step6")}
                />
                <FileUploadCard
                  courseFileName={courseFileName}
                  label="7. Final Exam Question and Answer Scripts"
                  description="Upload PDF or fill out form"
                  onClick={() => openDialog("step7")}
                />
                <FileUploadCard
                  courseFileName={courseFileName}
                  label="8. List of projects/assignments with description"
                  description="Upload PDF file"
                  onClick={() => openDialog("step8")}
                />
                <FileUploadCard
                  courseFileName={courseFileName}
                  label="9. List of lab experiments"
                  description="Upload PDF file"
                  onClick={() => openDialog("step9")}
                />
              </div>
            </>
          ) : (
            <CourseFileForm
              onSubmit={handleCourseFileSubmit}
              defaultCourseFileName={courseFileName}
              showContinueButton={Boolean(courseFileName)}
              onContinue={handleContinueToUpload}
              isLoading={isLoading} // Pass loading state
            />
          )}
        </div>
      </div>

      {/* Dialogs for each step */}
      {currentDialog === "step1" && (
        <Step1Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
          userId={userId}
        />
      )}
      {currentDialog === "step2" && (
        <Step2Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
          userId={userId}
        />
      )}
      {currentDialog === "step3" && (
        <Step3Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
          userId={userId}
        />
      )}
      {currentDialog === "step4" && (
        <Step4Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
          userId={userId}
        />
      )}

      {currentDialog === "step5" && (
        <Step5Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
          userId={userId}
        />
      )}
      {currentDialog === "step6" && (
        <Step6Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
          userId={userId}
        />
      )}
      {currentDialog === "step7" && (
        <Step7Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
          userId={userId}
        />
      )}
      {currentDialog === "step8" && (
        <Step8Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
          userId={userId}
        />
      )}

      {currentDialog === "step9" && (
        <Step9Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
          userId={userId}
        />
      )}
    </ContentLayout>
  );
}
