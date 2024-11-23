// File: /courseFiles/_components/utils/manageCourseFileState.js

export const loadState = () => {
  let state = {};
  try {
    if (typeof window !== "undefined") {
      state.selectedDepartment =
        localStorage.getItem("selectedDepartment") || "";
      state.selectedSemester = localStorage.getItem("selectedSemester") || "";
      state.selectedCourse = localStorage.getItem("selectedCourse") || "";
      state.courseFileName = localStorage.getItem("courseFileName") || "";
      const tableData = localStorage.getItem("tableData");
      state.tableData = tableData ? JSON.parse(tableData) : null;
      console.log("✅ State loaded successfully:", state);
    }
  } catch (error) {
    console.error("❌ Error loading state:", error);
  }
  return state;
};

export const saveState = (state) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "selectedDepartment",
        state.selectedDepartment || "",
      );
      localStorage.setItem("selectedSemester", state.selectedSemester || "");
      localStorage.setItem("selectedCourse", state.selectedCourse || "");
      localStorage.setItem("courseFileName", state.courseFileName || "");
      if (state.tableData) {
        localStorage.setItem("tableData", JSON.stringify(state.tableData));
      } else {
        localStorage.removeItem("tableData");
      }
      console.log("✅ State saved successfully:", state);
    }
  } catch (error) {
    console.error("❌ Error saving state:", error);
  }
};
