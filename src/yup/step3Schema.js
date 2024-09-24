// src/yup/step3Schema.js
import * as yup from "yup";
import { fields } from "../app/dashboard/upload-course-file/_components/InstructorFeedback"; // Import form fields

// Define word limits for each specific field
const wordLimits = {
  course_instructor: 2, // 2 words minimum for "Course Instructor"
  course_code_section: 1, // 2 words for "Course Code and Section"
  course_title: 1, // 3 words for "Course Title"
  semester: 1, // 2 words for "Semester"
  total_enrolled_students: 1, // 1 word for "Total Enrolled Students Count"
  total_withdrawal_count: 1, // 1 word for "Total Withdrawal Count"
  course_content_sufficient: 1, // 4 words for "Is the course content sufficient?"
  time_sufficient: 1, // 4 words for "Was the time sufficient?"
  teaching_methods: 1, // 4 words for "Teaching Methods"
  class_participation: 1, // 4 words for "Class Participation"
  e_platform_usage: 1, // 4 words for "E-Platform Usage"
  classroom_size_effect: 1, // 4 words for "Classroom Size Effect"
  assessment_performance: 1, // 4 words for "Assessment Performance"
  observation_suggestion: 1, // 4 words for "Observation & Suggestions"
};

// Build validation schema for each field
const formFieldSchemas = fields.reduce((acc, field) => {
  const wordLimit = wordLimits[field.name] || 4; // Default to 4 if not defined
  acc[field.name] = yup
    .string()
    .nullable()
    .test(
      "minWords",
      `${field.label} must have at least ${wordLimit} words`,
      function (value) {
        // Check word count, if value exists, ensure it meets the word limit
        return !value || value.trim().split(/\s+/).length >= wordLimit;
      },
    );
  return acc;
}, {});

export const step3Schema = yup
  .object()
  .shape({
    // Validate file input
    file: yup
      .mixed()
      .nullable()
      .test(
        "required",
        "File is required if no form data is provided",
        function (value) {
          const hasFormData = fields.some((field) => !!this.parent[field.name]);
          return value || hasFormData; // Either file or form data must be provided
        },
      ),

    // Spread the form field validation schemas
    ...formFieldSchemas,
  })
  .test(
    "one-of-file-or-form",
    "Either file or form must be provided, not both",
    function (value) {
      const hasPdf = !!value.file;
      const hasFormData = fields.some((field) => !!value[field.name]);

      // Both cannot be provided simultaneously, and one must be provided
      if ((hasPdf && hasFormData) || (!hasPdf && !hasFormData)) {
        return this.createError({
          message: "Either file or form must be provided, not both",
        });
      }
      return true;
    },
  );
