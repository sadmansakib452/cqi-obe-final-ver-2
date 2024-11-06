// File: src/app/dashboard/courseFiles/_components/dialogs/UploadDialog.jsx

import React, { useState } from "react";
import {
  Dialog as HeadlessDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import {
  useForm,
  FormProvider,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DropzoneInput from "@/components/forms/DropzoneInput";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { uploadStepsConfig } from "@/config/uploadStepsConfig";
import InstructorFeedback from "./InstructorFeedback";

const UploadDialog = ({
  step,
  courseFileName,
  userId,
  closeDialog,
  onUploadSuccess,
}) => {
  const config = uploadStepsConfig[step];
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const methods = useForm({
    resolver: yupResolver(config.validationSchema(courseFileName)),
    defaultValues: getDefaultValues(config),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = methods;

  // For dynamic fields (e.g., multiple exams)
  const { fields, append, remove } = useFieldArray({
    control,
    name: config.dynamic ? `${config.stepKey}s` : "file",
  });

  // Function to determine default values based on config
  function getDefaultValues(config) {
    if (config.dynamic) {
      return {
        [`${config.stepKey}s`]: [
          config.fields.reduce((acc, field) => {
            acc[field.name] = null;
            return acc;
          }, {}),
        ],
      };
    } else {
      return config.fields.reduce((acc, field) => {
        acc[field.name] = field.type === "file" ? null : "";
        return acc;
      }, {});
    }
  }

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setUploadStatus(null);
    const formData = new FormData();
    formData.append("userId", userId);

    if (config.dynamic) {
      data[`${config.stepKey}s`].forEach((section, index) => {
        config.fields.forEach((field) => {
          if (section[field.name]) {
            const file = section[field.name][0];
            const renamedFile = new File(
              [file],
              config.renamePattern(courseFileName, index, field.name),
              { type: file.type },
            );
            formData.append(
              `${config.stepKey.toUpperCase()}-${index + 1}.${field.name.toUpperCase()}`,
              renamedFile,
            );
            formData.append(
              "fileType",
              `${config.fileType}-${field.name.toUpperCase()}`,
            );
          }
        });
      });
    } else if (config.toggleable) {
      if (data.file) {
        // PDF upload
        const file = data.file[0];
        const renamedFile = new File(
          [file],
          config.renamePattern(courseFileName),
          { type: file.type },
        );
        formData.append("file", renamedFile);
        formData.append("fileType", config.fileType);
      } else if (data.text_area || data.form_data) {
        // Text or Form upload
        const payload = data.text_area || data.form_data;
        formData.append("text", JSON.stringify(payload));
        formData.append("fileType", config.fileType);
      }
    } else {
      // Single file upload
      if (data.file) {
        const file = data.file[0];
        const renamedFile = new File(
          [file],
          config.renamePattern(courseFileName),
          { type: file.type },
        );
        formData.append("file", renamedFile);
        formData.append("fileType", config.fileType);
      }
    }

    try {
      const response = await axios.post(
        `/api/course/${courseFileName}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        setUploadStatus("Upload successful");
        onUploadSuccess && onUploadSuccess(config.successKey || step);
        closeDialog();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeadlessDialog open onClose={closeDialog}>
      <DialogContent
        className="flex flex-col space-y-4 w-full max-w-lg mx-auto p-4 sm:p-6 sm:rounded-lg dark:bg-zinc-800"
        style={{
          minWidth: "320px",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-6"
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-medium w-full text-left text-gray-900 dark:text-gray-200">
                {config.title}
              </DialogTitle>
            </DialogHeader>

            {/* Toggle Buttons for PDF or Alternate Input (if toggleable) */}
            {config.toggleable && (
              <div className="flex items-center space-x-4 mb-4">
                {config.fields.map((field) => (
                  <Button
                    key={field.name}
                    type="button"
                    onClick={() => {
                      if (field.type === "file") {
                        setValue("text_area", ""); // Clear text when switching to PDF
                      } else {
                        setValue("file", null); // Clear file when switching to text/form
                      }
                    }}
                    disabled={
                      (field.type === "file" &&
                        watch("file") &&
                        watch("file").length > 0) ||
                      (field.type !== "file" &&
                        ((watch("text_area") &&
                          watch("text_area").length > 0) ||
                          (watch("form_data") &&
                            Object.keys(watch("form_data")).length > 0)))
                    }
                  >
                    {field.type === "file" ? "PDF Upload" : field.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Render Fields */}
            {config.dynamic ? (
              <div>
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
                        {config.title} {index + 1}
                      </h2>
                      {config.fields.map((field) => (
                        <Controller
                          key={field.name}
                          name={`${config.stepKey}s[${index}].${field.name}`}
                          control={control}
                          render={({ field: controllerField }) => (
                            <DropzoneInput
                              label={field.label}
                              id={`${config.stepKey}s[${index}].${field.name}`}
                              accept={field.accept}
                              helperText={field.helperText}
                              maxFiles={field.maxFiles}
                              {...controllerField}
                              onDrop={(acceptedFiles) => {
                                setValue(
                                  `${config.stepKey}s[${index}].${field.name}`,
                                  acceptedFiles,
                                );
                              }}
                            />
                          )}
                        />
                      ))}
                      {/* Remove Button */}
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-2 right-2 p-1 text-red-600 rounded-full hover:bg-red-100"
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
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* Add Button */}
                <Button
                  type="button"
                  onClick={() => append(getDefaultValues(config))}
                >
                  Add {config.title}
                </Button>
              </div>
            ) : (
              <>
                {config.fields.map((field) => {
                  if (field.type === "file") {
                    return (
                      <Controller
                        key={field.name}
                        name={field.name}
                        control={control}
                        render={({ field: controllerField }) => (
                          <DropzoneInput
                            label={field.label}
                            id={field.name}
                            accept={field.accept}
                            helperText={field.helperText}
                            maxFiles={field.maxFiles}
                            {...controllerField}
                            onDrop={(acceptedFiles) => {
                              setValue(field.name, acceptedFiles);
                            }}
                          />
                        )}
                      />
                    );
                  } else if (field.type === "textarea") {
                    return (
                      <div key={field.name} className="flex flex-col">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}
                        </label>
                        <Controller
                          name={field.name}
                          control={control}
                          render={({ field: controllerField }) => (
                            <textarea
                              {...controllerField}
                              id={field.name}
                              placeholder={field.placeholder || ""}
                              className={`mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                errors[field.name]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              rows={4}
                            />
                          )}
                        />
                        {errors[field.name] && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id={`${field.name}-error`}
                          >
                            {errors[field.name].message}
                          </p>
                        )}
                      </div>
                    );
                  } else if (
                    field.type === "custom" &&
                    field.component === "InstructorFeedback"
                  ) {
                    return <InstructorFeedback key={field.name} />;
                  }
                  return null;
                })}
              </>
            )}

            {/* Display Errors */}
            {Object.keys(errors).length > 0 && (
              <div className="text-red-600">
                {Object.values(errors).map((error, idx) => (
                  <p key={idx}>{error.message}</p>
                ))}
              </div>
            )}

            {/* Upload Status */}
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

            {/* Show Spinner if loading */}
            {loading && <Spinner />}

            {/* Submit and Cancel Buttons */}
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
    </HeadlessDialog>
  );
};

export default UploadDialog;
