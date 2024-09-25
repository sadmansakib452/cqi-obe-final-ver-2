'use client'
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
import FileUploadCard from "./_components/FileUploadCard"; // Use the card for each document
import Step1Dialog from "./_components/Step1Dialog";
import Step2Dialog from "./_components/Step2Dialog";
import Step3Dialog from "./_components/Step3Dialog";
import Step4Dialog from "./_components/Step4Dialog";
import Step5Dialog from "./_components/Step5Dialog";
import Step6Dialog from "./_components/Step6Dialog";
import Step7Dialog from "./_components/Step7Dialog";
import Step8Dialog from "./_components/Step8Dialog";
import Step9Dialog from "./_components/Step9Dialog";

export default function CourseFilePage() {
  const [courseFileName, setCourseFileName] = useState("");
  const [isCourseCreated, setIsCourseCreated] = useState(false);
  const [currentDialog, setCurrentDialog] = useState(null);

  useEffect(() => {
    const savedCourseFileName = localStorage.getItem("courseFileName");
    if (savedCourseFileName) {
      setCourseFileName(savedCourseFileName);
      setIsCourseCreated(true);
    }
  }, []);

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

  const handleContinueToUpload = () => {
    setIsCourseCreated(true);
  };

  const handleClearSession = () => {
    localStorage.removeItem("courseFileName");
    setCourseFileName("");
    setIsCourseCreated(false);
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

      <div className="bg-gray-50 py-8 min-h-screen">
        <div className="container mx-auto p-4">
          {isCourseCreated && (
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGoBack}
                  className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Back
                </button>

                <h2 className="text-xl font-bold text-blue-600">
                  Course File:{" "}
                  <span className="text-blue-700">{courseFileName}</span>
                </h2>
              </div>

              <button
                onClick={handleClearSession}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition"
              >
                <i className="fas fa-times mr-2"></i> Cancel Upload
              </button>
            </div>
          )}

          {!isCourseCreated ? (
            <CourseFileForm
              onSubmit={handleCourseFileSubmit}
              defaultCourseFileName={courseFileName}
              showContinueButton={Boolean(courseFileName)}
              onContinue={handleContinueToUpload}
            />
          ) : (
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
          )}
        </div>
      </div>

      {currentDialog === "step1" && (
        <Step1Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}
      {currentDialog === "step2" && (
        <Step2Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}
      {currentDialog === "step3" && (
        <Step3Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}
      {currentDialog === "step4" && (
        <Step4Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}
      {currentDialog === "step5" && (
        <Step5Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}
      {currentDialog === "step6" && (
        <Step6Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}
      {currentDialog === "step7" && (
        <Step7Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}
      {currentDialog === "step8" && (
        <Step8Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}
      {currentDialog === "step9" && (
        <Step9Dialog
          courseFileName={courseFileName}
          closeDialog={closeDialog}
        />
      )}
    </ContentLayout>
  );
}
