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
  closeDialog,
}) {
  const { register, handleSubmit, reset } = useForm();
  const [uploadStatus, setUploadStatus] = useState(null); // Track upload status

  // Handle the form submission for file/text upload
  const handleUpload = async (data) => {
    setUploadStatus(null); // Reset the status before starting upload

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
      closeDialog(); // Close the dialog
    } catch (error) {
      console.error("Error during upload:", error);
      setUploadStatus("Upload failed. Try again.");
    }
  };

  return (
    <Dialog open onClose={closeDialog}>
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
            <Button type="submit">Upload</Button>
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
