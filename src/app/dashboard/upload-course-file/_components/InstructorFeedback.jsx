import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

export const fields = [
  {
    name: "course_instructor",
    label: "Course Instructor",
    placeholder: "Jane Appleseed",
    section: "Instructor & Course Information",
  },
  {
    name: "course_code_section",
    label: "Course code and Section",
    placeholder: "CSE487 (Section 30)",
    section: "Instructor & Course Information",
  },
  {
    name: "course_title",
    label: "Course title",
    placeholder: "Cybersecurity, Law and Ethics",
    section: "Instructor & Course Information",
  },
  {
    name: "semester",
    label: "Semester",
    placeholder: "Fall 2023",
    section: "Instructor & Course Information",
  },
  {
    name: "total_enrolled_students",
    label: "Total enrolled students count",
    placeholder: "50 (0 dropped)",
    section: "Instructor & Course Information",
  },
  {
    name: "total_withdrawal_count",
    label: "Total withdrawal count",
    placeholder: "0",
    section: "Instructor & Course Information",
  },
  {
    name: "course_content_sufficient",
    label: "1. Is the course content sufficient?",
    placeholder: "Your comments",
    section: "Course Content",
  },
  {
    name: "time_sufficient",
    label:
      "2. Was the time available in the semester sufficient to cover the course contents?",
    placeholder: "Your comments",
    section: "Course Content",
  },
  {
    name: "teaching_methods",
    label:
      "3. Please mention the teaching-learning methods used throughout the course.",
    placeholder: "Your comments",
    section: "Course Content",
  },
  {
    name: "class_participation",
    label:
      "4. Please comment on the tendency of individual class participations of students during classes.",
    placeholder: "Your comments",
    section: "Course Content",
  },
  {
    name: "e_platform_usage",
    label:
      "5. Was there use of any e-platform for communication in course purposes?",
    placeholder: "Your comments",
    section: "Course Content",
  },
  {
    name: "classroom_size_effect",
    label:
      "6. Has the number of students with respect to classroom size affected teaching-learning interactions in the course?",
    placeholder: "Your comments",
    section: "Course Content",
  },
  {
    name: "assessment_performance",
    label:
      "7. Please comment on the trend of students' performances in different assessment approaches used throughout the course.",
    placeholder: "Your comments",
    section: "Course Content",
  },
  {
    name: "observation_suggestion",
    label:
      "8. Please mention overall observations and suggestions for the course",
    placeholder: "Your comments",
    section: "Course Content",
  },
];

const InstructorFeedback = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext(); // Extract form state and errors

  const getFieldsBySection = (section) => {
    return fields.filter((field) => field.section === section);
  };

  return (
    <div>
      <div>
        <h2 className="mt-6 mb-2 text-xl font-bold">
          Instructor & Course Information
        </h2>
        <hr className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getFieldsBySection("Instructor & Course Information").map(
            (field, index) => (
              <div key={index}>
                {/* Label wrapped around Input */}
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <Input
                  type="text"
                  id={field.name}
                  placeholder={field.placeholder}
                  {...register(field.name)} // Register field
                />
                {errors[field.name] && ( // Display error message if validation fails
                  <p className="text-sm text-red-600">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            ),
          )}
        </div>
      </div>
      <div>
        <h2 className="mt-6 mb-2 text-xl font-bold">Course Content</h2>
        <hr className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getFieldsBySection("Course Content").map((field, index) => (
            <div key={index}>
              {/* Label wrapped around Input */}
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <Input
                type="text"
                id={field.name}
                placeholder={field.placeholder}
                {...register(field.name)}
              />
              {errors[field.name] && (
                <p className="text-sm text-red-600">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorFeedback;
