// File: src/app/dashboard/courseFiles/_components/dialogs/Step1Dialog.jsx

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DropzoneInput from "@/components/forms/DropzoneInput";
import { Button } from "@/components/ui/button";
import { step1Schema } from "@/yup/step1Schema";
import Spinner from "@/components/Spinner";

/**
 * Dialog component for uploading Final Grades (Step 1).
 *
 * @param {Object} props - Component properties.
 * @param {string} props.courseFileName - Name of the course file.
 * @param {Function} props.closeDialog - Function to close the dialog.
 * @param {string} props.userId - ID of the user uploading the file.
 * @param {Function} props.onUploadSuccess - Callback to notify parent of successful upload.
 */
const Step1Dialog = ({
  courseFileName,
  closeDialog,
  userId,
  onUploadSuccess,
}) => {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(step1Schema(courseFileName)),
    defaultValues: { file: null },
  });

  const { handleSubmit, setValue, watch } = methods;
  const uploadedFile = watch("file");

  const renameFile = (file) => {
    if (file) {
      const renamedFile = new File(
        [file],
        `${courseFileName}.Final-GRADES.pdf`,
        { type: file.type },
      );
      return renamedFile;
    }
    return null;
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const renamedFile = renameFile(file);
    if (renamedFile) {
      setValue("file", [renamedFile], { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    if (!data.file || data.file.length === 0) {
      setUploadStatus("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("fileType", "FINAL-GRADES");
    formData.append("userId", userId);

    setLoading(true);
    setUploadStatus(null);

    try {
      const response = await fetch(`/api/course/${courseFileName}/upload`, {
        method: "POST",
        body: formData,
      });

      console.log('response : ', response)

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadStatus("Upload successful");
      setLoading(false);
      onUploadSuccess("finalGrades"); // Notify parent of success and trigger table refresh
      closeDialog();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={closeDialog}>
      <DialogContent
        className="flex flex-col space-y-4 w-full max-w-lg mx-auto p-4 sm:p-6 sm:rounded-lg dark:bg-zinc-800"
        style={{
          minWidth: "320px",
          maxWidth: "500px",
          margin: "0 auto", // Center the dialog
        }}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-6"
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-medium w-full text-left text-gray-900 dark:text-gray-200">
                Upload Final Grades (PDF)
              </DialogTitle>
            </DialogHeader>

            <div className="w-full">
              <DropzoneInput
                id="file"
                accept="application/pdf"
                maxFiles={1}
                helperText="Please upload the PDF file."
                label="Select PDF"
                onDrop={onDrop}
              />
            </div>

            {/* Show Spinner if loading is true */}
            {loading && (
              <div className="flex justify-center">
                <Spinner /> {/* Center the spinner */}
              </div>
            )}

            {/* Show status message if upload finished */}
            {uploadStatus && (
              <p
                className={`text-sm ${
                  uploadStatus.includes("successful")
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {uploadStatus}
              </p>
            )}

            <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="w-full sm:w-auto"
                disabled={loading} // Disable button when loading
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}{" "}
                {/* Button text changes based on loading state */}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default Step1Dialog;
