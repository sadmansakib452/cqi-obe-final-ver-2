// File: src/app/dashboard/courseFiles/_components/CourseFileForm.jsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { courseFileNameSchema } from "@/yup/courseFileNameSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";



const CourseFileForm = ({ onSubmit, onSearch, defaultCourseFileName }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { courseFileName: defaultCourseFileName || "" },
    resolver: yupResolver(courseFileNameSchema),
  });

  const handleFormSubmit = (data) => onSubmit(data);
  const handleSearchSubmit = (data) => onSearch(data);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Input
          type="text"
          id="courseFileName"
          label="Course File Name"
          placeholder="Enter course file name"
          {...register("courseFileName")}
        />
        {errors.courseFileName && (
          <p className="text-red-500 text-sm">
            {errors.courseFileName.message}
          </p>
        )}
      </div>

      <div className="flex space-x-4">
        <Button type="submit">Create Course File</Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit(handleSearchSubmit)}
          className="bg-blue-500 text-white"
        >
          Search Course File
        </Button>
      </div>
    </form>
  );
};

export default CourseFileForm;
