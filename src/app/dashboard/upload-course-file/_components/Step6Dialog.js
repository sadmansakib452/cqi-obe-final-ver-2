import { useState } from "react";
import {
  useForm,
  FormProvider,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { step6Schema } from "@/yup/step6Schema"; // Create a separate Yup schema for Step 6
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DropzoneInput from "@/components/forms/DropzoneInput"; // Existing dropzone component for file input
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export default function Step6Dialog({ courseFileName, closeDialog }) {
  const [customError, setCustomError] = useState("");

  // Initialize react-hook-form with Yup validation for Step 6
  const methods = useForm({
    resolver: yupResolver(step6Schema),
    defaultValues: {
      quizExams: [
        { question: null, highest: null, average: null, marginal: null }, // Default structure for quiz exam files
      ],
    },
  });

  const { handleSubmit, control, setValue, getValues } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "quizExams", // Field array for dynamic quiz exam sections
  });

  // Handle form submission
  const onSubmit = async (data) => {
    if (data.quizExams.length === 0) {
      setCustomError("At least one quiz exam is required.");
      return;
    }

    const formData = new FormData();

    data.quizExams.forEach((exam, index) => {
      // Append each file along with its fileType
      if (exam.question) {
        formData.append(`QUIZ-${index+1}.QUESTION`, exam.question[0]);
        formData.append("fileType", "Quiz-Question");
      }
      if (exam.highest) {
        formData.append(`QUIZ-${index+1}.HIGHEST`, exam.highest[0]);
        formData.append("fileType", "Quiz-Highest");
      }
      if (exam.average) {
        formData.append(`QUIZ-${index+1}.AVERAGE`, exam.average[0]);
        formData.append("fileType", "Quiz-Average");
      }
      if (exam.marginal) {
        formData.append(`QUIZ-${index+1}.MARGINAL`, exam.marginal[0]);
        formData.append("fileType", "Quiz-Marginal");
      }
    });

    try {

      
      const response = await fetch(`/api/course/${courseFileName}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      closeDialog();
    } catch (error) {
      setCustomError("Upload failed. Please try again.");
    }
  };

  // Add new quiz exam section
  const addQuizExam = () => {
    append({ question: null, highest: null, average: null, marginal: null });
    setCustomError(""); // Clear custom error on adding a new quiz exam
  };

  // Remove quiz exam section
  const removeQuizExam = (index) => {
    remove(index);
    setCustomError(""); // Clear custom error after removing a section
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
                Upload Quiz Exam Files
              </DialogTitle>
            </DialogHeader>

            {customError && (
              <p className="text-sm text-red-600">{customError}</p>
            )}

            {/* Render each quiz exam section */}
            <AnimatePresence>
              {fields.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border p-4 mb-4 rounded-lg relative"
                >
                  <h2 className="mb-4 text-xl font-medium">
                    Quiz Exam {index + 1}
                  </h2>

                  {/* Quiz Question Upload */}
                  <Controller
                    name={`quizExams[${index}].question`}
                    control={control}
                    render={({ field }) => (
                      <DropzoneInput
                        label="Quiz Question"
                        id={`quizExams[${index}].question`}
                        accept="application/pdf"
                        helperText="You can only drop .pdf file here"
                        maxFiles={1}
                        {...field}
                      />
                    )}
                  />

                  {/* Highest Scoring Script Upload */}
                  <Controller
                    name={`quizExams[${index}].highest`}
                    control={control}
                    render={({ field }) => (
                      <DropzoneInput
                        label="Highest Scoring Script"
                        id={`quizExams[${index}].highest`}
                        accept="application/pdf"
                        helperText="You can only drop .pdf file here"
                        maxFiles={1}
                        {...field}
                      />
                    )}
                  />

                  {/* Average Scoring Script Upload */}
                  <Controller
                    name={`quizExams[${index}].average`}
                    control={control}
                    render={({ field }) => (
                      <DropzoneInput
                        label="Average Scoring Script"
                        id={`quizExams[${index}].average`}
                        accept="application/pdf"
                        helperText="You can only drop .pdf file here"
                        maxFiles={1}
                        {...field}
                      />
                    )}
                  />

                  {/* Marginally Passed Script Upload */}
                  <Controller
                    name={`quizExams[${index}].marginal`}
                    control={control}
                    render={({ field }) => (
                      <DropzoneInput
                        label="Marginally Passed Script"
                        id={`quizExams[${index}].marginal`}
                        accept="application/pdf"
                        helperText="You can only drop .pdf file here"
                        maxFiles={1}
                        {...field}
                      />
                    )}
                  />

                  {/* Remove/Add Buttons */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuizExam(index)}
                        className="p-1 text-red-600 rounded-full hover:bg-red-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addQuizExam}
                      className="p-1 text-green-600 rounded-full hover:bg-green-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

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
