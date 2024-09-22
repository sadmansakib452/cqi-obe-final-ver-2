// src/app/dashboard/upload-course-file/_components/CourseFileForm.js
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input"; // ShadCN input component
import { Button } from "@/components/ui/button"; // ShadCN button component

export default function CourseFileForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data); // Send the course file name to the parent component
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="courseFileName">Enter Course File Name</label>
        <Input
          type="text"
          id="courseFileName"
          placeholder="Enter course file name"
          {...register("courseFileName", {
            required: "Course file name is required",
          })}
        />
        {errors.courseFileName && (
          <p className="text-red-500">{errors.courseFileName.message}</p>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
