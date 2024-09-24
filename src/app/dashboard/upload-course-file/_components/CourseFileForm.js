// src/app/dashboard/upload-course-file/_components/CourseFileForm.js

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input"; // ShadCN input component
import { Button } from "@/components/ui/button"; // ShadCN button component
import { courseFileNameSchema } from "@/yup/courseFileNameSchema"; // Import Yup schema

export default function CourseFileForm({
  onSubmit,
  defaultCourseFileName,
  showContinueButton,
  onContinue,
}) {
  // Initialize react-hook-form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { courseFileName: defaultCourseFileName || "" }, // Set default course file name
    resolver: yupResolver(courseFileNameSchema), // Integrate Yup schema for validation
  });

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
          {...register("courseFileName")} // Apply validation rules
        />
        {errors.courseFileName && (
          <p className="text-red-500">{errors.courseFileName.message}</p> // Show validation error
        )}
      </div>

      <div className="flex space-x-4">
        <Button type="submit">Submit</Button>

        {/* Show the "Continue to Current Course File" button if a session exists */}
        {showContinueButton && (
          <Button
            type="button"
            variant="outline"
            onClick={onContinue} // Calls the function to go to the upload page
            className="bg-green-600 hover:bg-green-600 text-white"
          >
            Continue to Current Course File
          </Button>
        )}
      </div>
    </form>
  );
}
