import * as yup from "yup";

export const step2Schema = yup
  .object()
  .shape({
    file: yup
      .mixed()
      .nullable()
      .test(
        "file-or-text-required",
        "File is required when text is not provided",
        function (value) {
          const { text_area } = this.parent;
          console.log("File validation - File:", value, "Text:", text_area); // Log validation data
          return value || text_area ? true : false;
        },
      ),
    text_area: yup
      .string()
      .nullable()
      .test(
        "text-or-file-required",
        "Text is required when file is not provided",
        function (value) {
          const { file } = this.parent;
          console.log("Text validation - Text:", value, "File:", file); // Log validation data
          return value || file ? true : false;
        },
      )
      .test("minWords", "Text must have at least 10 words", function (value) {
        if (!value) return true; // If the text is not provided, skip the word count check
        console.log("Word count validation - Text:", value);
        return value.split(" ").length >= 10;
      }),
  })
  .test(
    "one-of-file-or-text",
    "Either file or text must be provided, not both",
    function (value) {
      const { file, text_area } = value;
      console.log("One of File or Text - File:", file, "Text:", text_area); // Log validation data
      if ((file && text_area) || (!file && !text_area)) {
        return this.createError({
          message: "Either file or text must be provided, not both",
        });
      }
      return true;
    },
  );
