import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { step7Schema } from "@/yup/Step7Schema"; // Create a separate Yup schema file
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import DropzoneInput from "@/components/forms/DropzoneInput";
import { Button } from "@/components/ui/button";

export default function Step7Dialog({ courseFileName, closeDialog }) {
  const [uploadStatus, setUploadStatus] = useState(null);

  // Initialize react-hook-form with Yup validation for Step 7
  const methods = useForm({
    resolver: yupResolver(step7Schema),
    defaultValues: {
      finalExam: {
        question: null,
        highest: null,
        average: null,
        marginal: null,
      },
    },
  });

  const { handleSubmit, control, watch } = methods;
  const finalExamFiles = watch("finalExam");

  const renameFile = (key) => {
    const file = finalExamFiles?.[key]?.[0];
    if (file) {
      return new File([file], `${courseFileName}.FinalExam-${key}.pdf`, {
        type: file.type,
      });
    }
    return null;
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append files with renamed filenames
    Object.keys(data.finalExam).forEach((key) => {
      const renamedFile = renameFile(key);
      console.log('final', renamedFile)
      if (renamedFile) {
        const KEY = key.toUpperCase()
        formData.append(`FINAL.${KEY}`, renamedFile);
        formData.append("fileType", `FinalExam-${key}`);
      }
    });

    if (
      !formData.has("FINAL.QUESTION") ||
      !formData.has("FINAL.HIGHEST") ||
      !formData.has("FINAL.AVERAGE") ||
      !formData.has("FINAL.MARGINAL")
    ) {
      setUploadStatus("Please upload all required files.");
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
      closeDialog(); // Close dialog on success
    } catch (error) {
      setUploadStatus("Upload failed. Please try again.");
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
                Upload Final Exam Files
              </DialogTitle>
            </DialogHeader>

            {/* Final Exam Question Upload */}
            <Controller
              name="finalExam.question"
              control={control}
              render={({ field }) => (
                <DropzoneInput
                  label="Final Question"
                  id="finalExam.question"
                  accept="application/pdf"
                  helperText="You can only drop .pdf file here"
                  maxFiles={1}
                  {...field}
                />
              )}
            />
            {/* Highest Scoring Script Upload */}
            <Controller
              name="finalExam.highest"
              control={control}
              render={({ field }) => (
                <DropzoneInput
                  label="Highest Scoring Script"
                  id="finalExam.highest"
                  accept="application/pdf"
                  helperText="You can only drop .pdf file here"
                  maxFiles={1}
                  {...field}
                />
              )}
            />
            {/* Average Scoring Script Upload */}
            <Controller
              name="finalExam.average"
              control={control}
              render={({ field }) => (
                <DropzoneInput
                  label="Average Scoring Script"
                  id="finalExam.average"
                  accept="application/pdf"
                  helperText="You can only drop .pdf file here"
                  maxFiles={1}
                  {...field}
                />
              )}
            />
            {/* Marginally Passed Script Upload */}
            <Controller
              name="finalExam.marginal"
              control={control}
              render={({ field }) => (
                <DropzoneInput
                  label="Marginally Passed Script"
                  id="finalExam.marginal"
                  accept="application/pdf"
                  helperText="You can only drop .pdf file here"
                  maxFiles={1}
                  {...field}
                />
              )}
            />

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
