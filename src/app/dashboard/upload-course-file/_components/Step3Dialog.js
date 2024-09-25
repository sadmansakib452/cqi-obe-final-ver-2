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

  // Initialize react-hook-form with Yup validation for Step 3 and `mode: "onBlur"`
  const methods = useForm({
    resolver: yupResolver(step3Schema),
    mode: "onBlur", // Trigger validation onBlur and during submission
    reValidateMode: "onChange", // Optional: validates on change for continuous feedback
    defaultValues: { courseFileName, file: null, form_data: "" },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods; // Access formState to get errors
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

    if (isPdfUpload && data.file) {
      renameFile(); // Rename file before sending
      formData.append("file", data.file[0]); // Append renamed file
      formData.append("fileType", "INSTRUCTOR-FEEDBACK");
    } else if (!isPdfUpload) {
      const formJsonData = JSON.stringify(data); // Convert form data to JSON
      formData.append("text", formJsonData); // Append JSON data
      formData.append("fileType", "INSTRUCTOR-FEEDBACK");
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
      <DialogContent className="flex flex-col space-y-4 max-h-[80vh] overflow-y-auto">
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

            {/* Show validation errors for PDF */}
            {errors.file && (
              <p className="text-red-600">{errors.file.message}</p>
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
