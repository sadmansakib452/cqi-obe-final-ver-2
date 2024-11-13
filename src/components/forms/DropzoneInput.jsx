// File: src/components/DropzoneInput.jsx

import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FilePreview } from "./FilePreview";
import clsx from "clsx";

/**
 * DropzoneInput Component
 *
 * A file upload component that integrates with react-hook-form and react-dropzone.
 * It supports both single and multiple file uploads with previews and deletion functionality.
 *
 * Props:
 * - accept: File types accepted by the dropzone.
 * - helperText: Additional helper text displayed below the dropzone.
 * - id: Unique identifier for the input field.
 * - label: Label for the dropzone.
 * - maxFiles: Maximum number of files allowed.
 * - validation: Validation rules for react-hook-form.
 * - readOnly: If true, disables file uploads and hides delete buttons.
 */
export default function DropzoneInput({
  accept,
  helperText = "",
  id,
  label,
  maxFiles = 1,
  validation,
  readOnly,
}) {
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [files, setFiles] = useState([]);

  /**
   * onDrop Callback
   *
   * Handles the drop event from react-dropzone.
   * Updates local state and react-hook-form's state accordingly.
   */
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      console.log("onDrop triggered");
      console.log("Accepted Files:", acceptedFiles);
      console.log("Rejected Files:", rejectedFiles);

      if (rejectedFiles && rejectedFiles.length > 0) {
        console.log("Handling rejected files");
        setError(id, {
          type: "manual",
          message: rejectedFiles[0].errors[0].message,
        });
        return;
      }

      const acceptedFilesPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      const newFiles = files
        ? [...files, ...acceptedFilesPreview].slice(0, maxFiles)
        : acceptedFilesPreview;

      setFiles(newFiles);
      setValue(id, acceptedFiles.slice(0, maxFiles), { shouldValidate: true });
      clearErrors(id);

      console.log("Files after drop:", newFiles);
    },
    [clearErrors, files, id, maxFiles, setError, setValue],
  );

  /**
   * Effect Hook
   *
   * Revokes object URLs to avoid memory leaks when component unmounts or files change.
   */
  useEffect(() => {
    return () => {
      console.log("Cleaning up object URLs");
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  /**
   * deleteFile Handler
   *
   * Removes a file from the dropzone and updates state accordingly.
   *
   * @param {Event} e - The event object.
   * @param {File} file - The file to be deleted.
   */
  const deleteFile = (e, file) => {
    e.preventDefault();
    console.log("Deleting file:", file);

    const newFiles = [...files];
    const index = newFiles.indexOf(file);
    if (index > -1) {
      newFiles.splice(index, 1);
    }

    setFiles(newFiles);
    setValue(id, newFiles.length > 0 ? newFiles : null, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    console.log("Files after deletion:", newFiles);
  };

  /**
   * useDropzone Hook
   *
   * Initializes react-dropzone with specified configurations.
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize: 2000000, // Maximum file size of 2MB
  });

  /**
   * handlePointerDown
   *
   * Handles pointer down events to ensure compatibility with both mouse and touch interactions.
   */
  const handlePointerDown = () => {
    console.log("Pointer down on dropzone");
  };

  return (
    <div className="w-full">
      {/* Label for the Dropzone */}
      <label
        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        htmlFor={id}
      >
        {label}
      </label>

      {/* Conditional Rendering Based on readOnly and file count */}
      {readOnly && !(files?.length > 0) ? (
        <div className="py-3 pl-3 pr-4 text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 divide-y divide-gray-300 dark:divide-gray-600 rounded-md">
          No file uploaded
        </div>
      ) : files?.length >= maxFiles ? (
        // Display file previews if max files are uploaded
        <ul className="mt-2 border border-gray-300 dark:border-gray-700 divide-y divide-gray-300 dark:divide-gray-600 rounded-md">
          {files.map((file, index) => (
            <FilePreview
              key={index}
              readOnly={readOnly}
              file={file}
              deleteFile={deleteFile}
            />
          ))}
        </ul>
      ) : (
        // Render Dropzone for file upload
        <>
          <div
            {...getRootProps({
              onPointerDown: handlePointerDown,
              className: clsx(
                "w-full mt-2 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 border-dashed rounded cursor-pointer",
                {
                  "bg-blue-50 border-blue-500": isDragActive,
                },
              ),
            })}
          >
            <input
              {...getInputProps()}
              id={id}
              aria-label={label}
              // Removed {...field} to prevent conflicts
            />
            <div className="text-center space-y-2">
              <p className="text-gray-500 dark:text-gray-400">
                {isDragActive
                  ? "Drop the files here ..."
                  : "Drag &apos;n&apos; drop some files here, or click to select files"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {`${maxFiles - (files?.length || 0)} file(s) remaining`}
              </p>
            </div>
          </div>

          {/* Helper text for the dropzone */}
          {helperText && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}

          {/* Error display */}
          {errors[id] && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">
              {errors[id].message}
            </p>
          )}

          {/* Display files if any */}
          {!readOnly && !!files.length && (
            <ul className="mt-2 border border-gray-300 dark:border-gray-700 divide-y divide-gray-300 dark:divide-gray-600 rounded-md">
              {files.map((file, index) => (
                <FilePreview
                  key={index}
                  readOnly={readOnly}
                  file={file}
                  deleteFile={deleteFile}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
