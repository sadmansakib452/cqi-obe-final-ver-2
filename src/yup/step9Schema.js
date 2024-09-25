import * as yup from "yup";

// Define Yup schema for Step 9
export const step9Schema = (courseFileName) =>
  yup.object().shape({
    file: yup
      .mixed()
      .required("File is required")
      .test("fileType", "Only PDF files are allowed", (value) => {
        return value && value[0] && value[0].type === "application/pdf";
      }),
  });
