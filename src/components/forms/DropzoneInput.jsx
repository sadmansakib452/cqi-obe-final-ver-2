import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FilePreview } from "./FilePreview";

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
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [files, setFiles] = useState(getValues(id) || []);

  console.log(files);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        setValue(id, files ? [...files] : null);
        setError(id, {
          type: "manual",
          message: rejectedFiles[0].errors[0].message,
        });
      } else {
        const acceptedFilesPreview = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );

        setFiles(
          files
            ? [...files, ...acceptedFilesPreview].slice(0, maxFiles)
            : acceptedFilesPreview,
        );

        setValue(
          id,
          files
            ? [...files, ...acceptedFiles].slice(0, maxFiles)
            : acceptedFiles,
          { shouldValidate: true },
        );
        clearErrors(id);
      }
    },
    [clearErrors, files, id, maxFiles, setError, setValue],
  );

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const deleteFile = (e, file) => {
    e.preventDefault();
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);

    if (newFiles.length > 0) {
      setFiles(newFiles);
      setValue(id, newFiles, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } else {
      setFiles([]);
      setValue(id, null, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize: 2000000, // Maximum file size of 2MB
  });

  return (
    <div className="w-full">
      {/* Label for the Dropzone */}
      <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>

      {/* If it's read-only and no files are uploaded */}
      {readOnly && !(files?.length > 0) ? (
        <div className="py-3 pl-3 pr-4 text-sm border border-gray-300 divide-y divide-gray-300 rounded-md">
          No file uploaded
        </div>
      ) : files?.length >= maxFiles ? (
        // If max files are uploaded, display file previews
        <ul className="mt-2 border border-gray-300 divide-y divide-gray-300 rounded-md">
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
        <Controller
          control={control}
          name={id}
          rules={validation}
          render={({ field }) => (
            <>
              <div
                {...getRootProps()}
                className="w-full mt-2 p-4 bg-gray-100 border border-gray-300 border-dashed rounded cursor-pointer"
              >
                <input {...getInputProps()} {...field} />
                <div className="text-center space-y-2">
                  <p className="text-gray-500">
                    Drag &apos;n&apos; drop some files here, or click to select
                    files
                  </p>
                  <p className="text-xs text-gray-500">
                    {`${maxFiles - (files?.length || 0)} file(s) remaining`}
                  </p>
                </div>
              </div>

              {/* Helper text for the dropzone */}
              {helperText && (
                <p className="mt-2 text-xs text-gray-500">{helperText}</p>
              )}

              {/* Error display */}
              {errors[id] && (
                <p className="mt-2 text-sm text-red-500">
                  {errors[id].message}
                </p>
              )}

              {/* Display files if any */}
              {!readOnly && !!files.length && (
                <ul className="mt-2 border border-gray-300 divide-y divide-gray-300 rounded-md">
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
        />
      )}
    </div>
  );
}
