// File: /src/app/dashboard/courseFiles/_components/CourseFileForm.js
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { courseFileNameSchema } from "@/yup/courseFileNameSchema";

export default function CourseFileForm({
  onSubmit,
  onSearch,
  defaultCourseFileName,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { courseFileName: defaultCourseFileName || "" },
    resolver: yupResolver(courseFileNameSchema),
  });

  const handleFormSubmit = (data) => onSubmit(data);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="courseFileName">Course File Name</label>
        <Input
          type="text"
          id="courseFileName"
          placeholder="Enter course file name"
          {...register("courseFileName")}
        />
        {errors.courseFileName && (
          <p className="text-red-500">{errors.courseFileName.message}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <Button type="submit">Create Course File</Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit(onSearch)}
          className="bg-blue-500 text-white"
        >
          Search Course File
        </Button>
      </div>
    </form>
  );
}
