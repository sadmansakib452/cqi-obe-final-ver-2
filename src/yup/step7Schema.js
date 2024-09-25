import * as yup from "yup";

// Final exam schema validation
export const step7Schema = yup.object().shape({
  finalExam: yup.object().shape({
    question: yup
      .mixed()
      .required("Final Question file is required")
      .test("fileType", "Only PDF files are allowed", (value) => {
        return value && value[0].type === "application/pdf";
      }),
    highest: yup
      .mixed()
      .required("Highest Scoring Script file is required")
      .test("fileType", "Only PDF files are allowed", (value) => {
        return value && value[0].type === "application/pdf";
      }),
    average: yup
      .mixed()
      .required("Average Scoring Script file is required")
      .test("fileType", "Only PDF files are allowed", (value) => {
        return value && value[0].type === "application/pdf";
      }),
    marginal: yup
      .mixed()
      .required("Marginally Passed Script file is required")
      .test("fileType", "Only PDF files are allowed", (value) => {
        return value && value[0].type === "application/pdf";
      }),
  }),
});
