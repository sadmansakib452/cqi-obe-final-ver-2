// src/app/dashboard/upload-course-file/_components/Step3Dialog.js
import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { step3Schema } from "@/yup/step3Schema"; // Schema for Step 3
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import DropzoneInput from "@/components/forms/DropzoneInput";
import InstructorFeedback from "./InstructorFeedback.jsx"; // Form component
import { Button } from "@/components/ui/button";

export default function Step3Dialog({ courseFileName, closeDialog }) {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isPdfUpload, setIsPdfUpload] = useState(true); // Toggle between PDF and Form

  // Initialize react-hook-form with Yup validation for Step 3
  const methods = useForm({
    resolver: yupResolver(step3Schema),
    defaultValues: { courseFileName, file: null },
  });

  const { handleSubmit, setValue, watch } = methods;
  const uploadedFile = watch("file");

  // PDF renaming logic
  const renameFile = () => {
    const file = uploadedFile && uploadedFile[0];
    if (file) {
      const renamedFile = new File(
        [file],
        `${courseFileName}.INSTRUCTOR-FEEDBACK.pdf`, // Rename the file appropriately
        { type: file.type },
      );
      setValue("file", [renamedFile], { shouldValidate: true });
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Check if the user is uploading a PDF
    if (isPdfUpload && data.file) {
      renameFile(); // Rename file before sending
      formData.append("file", data.file[0]); // Append renamed file
      formData.append("fileType", "Instructor-Feedback");
    }
    // Handle form data submission
    else if (!isPdfUpload) {
      // Ensure form data is passed correctly
      const formJsonData = JSON.stringify({
        ...data, // Include all form data (non-null fields only)
      });
      formData.append("text", formJsonData); // Append JSON data
      formData.append("fileType", "Instructor-Feedback");
    } else {
      setUploadStatus("No data provided");
      return;
    }

    try {
      const response = await fetch(`/api/course/${courseFileName}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadStatus("Upload successful");
      closeDialog();
    } catch (error) {
      setUploadStatus("Upload failed. Try again.");
    }
  };

  return (
    <Dialog open onClose={closeDialog}>
      <DialogContent
        className="flex flex-col space-y-4 max-h-[80vh] overflow-y-auto" // Ensure dialog is scrollable
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-6"
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-medium w-full text-left">
                Upload Instructor Feedback (PDF or Form)
              </DialogTitle>
            </DialogHeader>

            {/* Toggle Buttons for PDF or Form Upload */}
            <div className="flex items-center space-x-4 mb-4">
              <Button
                type="button"
                onClick={() => {
                  setIsPdfUpload(true);
                  setValue("form_data", ""); // Clear form data when switching
                }}
                disabled={isPdfUpload}
              >
                PDF Upload
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsPdfUpload(false);
                  setValue("file", null); // Clear file input when switching
                }}
                disabled={!isPdfUpload}
              >
                Form
              </Button>
            </div>

            {/* Conditional Rendering based on isPdfUpload */}
            {isPdfUpload ? (
              <Controller
                name="file"
                control={methods.control}
                render={({ field }) => (
                  <DropzoneInput
                    label="Instructor Feedback (PDF)"
                    id="file"
                    accept="application/pdf"
                    helperText="You can only drop .pdf file here"
                    maxFiles={1}
                    {...field}
                  />
                )}
              />
            ) : (
              <InstructorFeedback /> // Form data component
            )}

            {uploadStatus && (
              <p
                className={`text-sm ${
                  uploadStatus.includes("successful")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {uploadStatus}
              </p>
            )}

            <DialogFooter className="flex justify-between space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Upload
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
