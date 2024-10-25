import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { step2Schema } from "@/yup/step2Schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DropzoneInput from "@/components/forms/DropzoneInput";
import Textarea from "@/components/forms/Textarea";
import { Button } from "@/components/ui/button";

export default function Step2Dialog({ courseFileName, closeDialog, userId }) {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isPdfUpload, setIsPdfUpload] = useState(true); // Toggle between PDF and Text Editor
  const [loading, setLoading] = useState(false); // To manage loading state

  // Initialize react-hook-form with Yup validation
  const methods = useForm({
    resolver: yupResolver(step2Schema),
    defaultValues: { courseFileName, file: null, text_area: "" },
  });

  const { handleSubmit, setValue, watch } = methods;
  const uploadedFile = watch("file");
  const textAreaValue = watch("text_area");

  // Debugging: Log current form values
  console.log("Uploaded file:", uploadedFile);
  console.log("Text area value:", textAreaValue);

  // PDF renaming logic
  const renameFile = () => {
    const file = uploadedFile && uploadedFile[0];
    if (file) {
      const renamedFile = new File(
        [file],
        `${courseFileName}-OBE-SUMMARY.pdf`, // Example predefined name
        { type: file.type },
      );
      console.log("Renamed file:", renamedFile); // Log renamed file
      setValue("file", [renamedFile], { shouldValidate: true });
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data); // Log submitted data
    if (loading) return; // Prevent multiple submissions

    const formData = new FormData();
    formData.append("userId", userId);

    // Check whether PDF upload or text area is being submitted
    if (isPdfUpload && data.file) {
      renameFile(); // Rename the file before sending
      formData.append("file", data.file[0]); // Append renamed file
      formData.append("fileType", "OBE-SUMMARY");
      console.log("Appending file for upload:", data.file[0]); // Log file being uploaded
    } else if (data.text_area) {
      const textData = JSON.stringify({
        content: data.text_area, // Convert text to JSON object
      });
      formData.append("text", textData); // Append JSON data
      formData.append("fileType", "OBE-SUMMARY");
      console.log("Appending text for upload:", textData); // Log text being uploaded
    } else {
      setUploadStatus("No data provided");
      console.error("No data provided."); // Log error if no file or text
      return;
    }

    setLoading(true); // Show spinner during upload

    try {
      const response = await fetch(`/api/course/${courseFileName}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadStatus("Upload successful");
      setLoading(false); // Stop spinner
      closeDialog();
      console.log("Upload successful");
    } catch (error) {
      setUploadStatus("Upload failed. Try again.");
      setLoading(false);
      console.error("Error uploading file:", error); // Log error
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
                Upload OBE Summary
              </DialogTitle>
            </DialogHeader>

            {/* Toggle Buttons for PDF or Text Editor */}
            <div className="flex items-center space-x-4 mb-4">
              <Button
                type="button"
                onClick={() => {
                  setIsPdfUpload(true);
                  setValue("text_area", ""); // Clear text editor content when switching
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
                Text Editor
              </Button>
            </div>

            {/* Conditionally render based on isPdfUpload */}
            {isPdfUpload ? (
              <Controller
                name="file"
                control={methods.control}
                render={({ field }) => (
                  <DropzoneInput
                    label="Select PDF or Text"
                    id="file"
                    accept="application/pdf"
                    helperText="You can only drop .pdf file here"
                    maxFiles={1}
                    {...field}
                  />
                )}
              />
            ) : (
              <Textarea
                id="text_area"
                label="Instructor Feedback (Text)"
                name="text_area"
                control={methods.control}
                Controller={Controller}
                error={methods.formState}
              />
            )}

            {/* Upload status */}
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

            {/* Footer buttons */}
            <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="w-full sm:w-auto"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
