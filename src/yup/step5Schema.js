import * as yup from "yup";

// Validation schema for the mid-exams files
export const step5Schema = yup.object().shape({
  midExams: yup.array().of(
    yup.object().shape({
      question: yup
        .mixed()
        .required("Mid Question file is required")
        .test("fileType", "Only PDF files are allowed", (value) => {
          if (!value || !value.length) return false;
          return value[0].type === "application/pdf";
        }),
      highest: yup
        .mixed()
        .required("Highest Scoring Script file is required")
        .test("fileType", "Only PDF files are allowed", (value) => {
          if (!value || !value.length) return false;
          return value[0].type === "application/pdf";
        }),
      average: yup
        .mixed()
        .required("Average Scoring Script file is required")
        .test("fileType", "Only PDF files are allowed", (value) => {
          if (!value || !value.length) return false;
          return value[0].type === "application/pdf";
        }),
      marginal: yup
        .mixed()
        .required("Marginally Passed Script file is required")
        .test("fileType", "Only PDF files are allowed", (value) => {
          if (!value || !value.length) return false;
          return value[0].type === "application/pdf";
        }),
    }),
  ),
});
