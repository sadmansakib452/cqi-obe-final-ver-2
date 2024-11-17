// File: /courseFiles/_components/utils/manageCourseFileState.js

export const manageCourseFileState = () => {
  /**
   * Loads state variables from local storage.
   *
   * @returns {Object} An object containing the state variables.
   */
  const loadState = () => {
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
    return { state };
  };

  /**
   * Saves state variables to local storage.
   *
   * @param {Object} state - The state variables to save.
   */
  const saveState = (state) => {
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

  return {
    loadState,
    saveState,
  };
};
