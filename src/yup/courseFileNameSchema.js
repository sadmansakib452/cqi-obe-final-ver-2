import * as yup from "yup";

// Define Yup schema for Course File Name
export const courseFileNameSchema = yup.object().shape({
  courseFileName: yup
    .string()
    .required("Course file name is required")
    .matches(
      /^[0-9]{4}\.[1-2]\.CSE[0-9]{3}-[0-9]{1,2}$/,
      "Course file name must be in the format: YYYY.S.CourseCode-Section",
    ),
});
