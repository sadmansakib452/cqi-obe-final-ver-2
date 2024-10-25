import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DropzoneInput from "@/components/forms/DropzoneInput";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner"; // Import Spinner
import { step1Schema } from "@/yup/step1Schema"; // Importing Step 1 schema

export default function Step1Dialog({ courseFileName, closeDialog, userId }) {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  // Initialize react-hook-form with Yup validation for Step 1
  const methods = useForm({
    resolver: yupResolver(step1Schema(courseFileName)),
    defaultValues: { courseFileName, file: null }, // Set default values
  });

  const { handleSubmit, setValue, watch } = methods;
  const uploadedFile = watch("file");

  // Rename file on drop to match the course file convention
  const renameFile = (file) => {
    if (file) {
      const renamedFile = new File(
        [file],
        `${courseFileName}.Final-GRADES.pdf`,
        { type: file.type },
      );
      return renamedFile; // Return the renamed file for further use
    }
    return null;
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]; // Take the first dropped file
    const renamedFile = renameFile(file); // Rename the file
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
    formData.append("file", data.file[0]); // Add renamed file
    formData.append("fileType", "FINAL-GRADES");
    formData.append("userId", userId);

    setLoading(true); // Start loading when upload begins
    setUploadStatus(null); // Reset status

    try {
      const response = await fetch(`/api/course/${courseFileName}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadStatus("Upload successful");
      setLoading(false); // Stop loading
      closeDialog(); // Close the dialog
    } catch (error) {
      setUploadStatus("Upload failed. Try again.");
      setLoading(false); // Stop loading if failed
    }
  };

  return (
    <Dialog open onOpenChange={closeDialog}>
      <DialogContent
        className="flex flex-col space-y-4 w-full max-w-lg mx-auto p-4 sm:p-6 sm:rounded-lg"
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
              <DialogTitle className="text-lg font-medium w-full text-left">
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
                onDrop={onDrop} // Handle file selection
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
                    ? "text-green-600"
                    : "text-red-600"
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
}
