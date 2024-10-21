// src/app/dashboard/upload-course-file/_components/FileUploadDialog.js
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog"; // ShadCN dialog components
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component

export default function FileUploadDialog({
  courseFileName, // Passed dynamically to the component
  label,
  type, // Determines if it's a file upload or text upload
  closeDialog, // Passed from parent component to close the dialog
  isOpen, // Add the isOpen prop to control the dialog's open state
}) {
  const { register, handleSubmit, reset } = useForm();
  const [uploadStatus, setUploadStatus] = useState(null); // Track upload status
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the form submission state

  // Handle the form submission for file/text upload
  const handleUpload = async (data) => {
    setUploadStatus(null); // Reset the status before starting upload
    setIsSubmitting(true); // Disable button to prevent multiple submissions

    const formData = new FormData(); // Create FormData object to send files/text

    // If it's a file, append the file to FormData
    if (type === "file" && data.file?.[0]) {
      formData.append("file", data.file[0]); // Append the file
      console.log("Uploading file:", data.file[0].name); // Log file details
    }
    // If it's text, append the text to FormData
    else if (type === "text" && data.text) {
      formData.append("text", data.text); // Append the text
      console.log("Uploading text:", data.text); // Log text details
    } else {
      setUploadStatus("No file or text provided.");
      setIsSubmitting(false); // Re-enable submission
      return;
    }

    try {
      // Send the form data (file or text) to the backend
      const response = await fetch(`/api/course/${courseFileName}/upload`, {
        method: "POST",
        body: formData, // Send as multipart/form-data
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadStatus("Upload successful!");
      reset(); // Reset the form after successful upload
      closeDialog(); // Close the dialog after success
    } catch (error) {
      console.error("Error during upload:", error);
      setUploadStatus("Upload failed. Try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      {/* Ensure `onOpenChange` is linked to `closeDialog` */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload {label}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleUpload)} className="space-y-4">
          {type === "file" ? (
            <Input
              type="file"
              {...register("file", { required: true })} // Register file input
            />
          ) : (
            <Input
              type="text"
              placeholder="Enter text"
              {...register("text", { required: true })} // Register text input
            />
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>

        {uploadStatus && (
          <div
            className={`mt-4 ${
              uploadStatus.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {uploadStatus}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
