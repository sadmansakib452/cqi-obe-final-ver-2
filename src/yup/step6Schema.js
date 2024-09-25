import * as yup from "yup";

export const step6Schema = yup.object().shape({
  quizExams: yup
    .array()
    .of(
      yup.object().shape({
        question: yup
          .mixed()
          .required("Quiz Question file is required")
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
    )
    .min(1, "At least one quiz exam is required"),
});
