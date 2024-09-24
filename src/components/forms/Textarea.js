// src/components/forms/Textarea.js
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Textarea({
  Controller,
  control,
  label,
  name,
  id,
  error: { errors },
}) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", { color: [] }],
      [{ "code-block": true }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "code-block",
    "color",
  ];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor={id}>
            {label}
          </label>
          <ReactQuill
            theme="snow"
            value={field.value || ""}
            onChange={field.onChange}
            modules={modules}
            formats={formats}
          />
          {errors[id] && (
            <p className="text-sm text-red-500 mt-2">{errors[id]?.message}</p>
          )}
        </div>
      )}
    />
  );
}
