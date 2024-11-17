// File: /components/DynamicForm.jsx

"use client"
import React, { useContext, useState, useEffect } from "react";
import formConfig from "../_components/data/formConfig.json";
import Dropdown from "./Dropdown";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";
import { CourseFileContext } from "./context/CourseFileContext";
import {capitalizeFirstLetter} from './utils'
/**
 * DynamicForm component that renders form fields based on configuration.
 *
 * @returns {JSX.Element} - The rendered form component.
 */
const DynamicForm = () => {
  const {
    selectedDepartment,
    setSelectedDepartment,
    selectedSemester,
    setSelectedSemester,
    selectedCourse,
    setSelectedCourse,
    fetchAndSetCourses,
    generateAndSetCourseFileName,
  } = useContext(CourseFileContext);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * Capitalizes the first letter of a string.
   *
   * @param {string} str - The string to capitalize.
   * @returns {string} - The capitalized string.
   */
  // const capitalizeFirstLetter = (str) => {
  //   if (!str) return "";
  //   return str.charAt(0).toUpperCase() + str.slice(1);
  // };

  /**
   * Validates the form fields based on configuration.
   *
   * @returns {boolean} - Whether the form is valid.
   */
  const validateFields = () => {
    const newErrors = {};
    formConfig.fields.forEach((field) => {
      const value = eval(`selected${capitalizeFirstLetter(field.name)}`);
      if (field.validation.required && !value) {
        newErrors[field.name] = field.validation.message;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the final form submission.
   */
  const handleSubmit = async () => {
    if (validateFields()) {
      setLoading(true);
      await fetchAndSetCourses();
      generateAndSetCourseFileName();
      setLoading(false);
    }
  };

  /**
   * Effect to clear course and course file name if the selected course is invalid.
   */
  useEffect(() => {
    if (selectedCourse) {
      const courseExists = formConfig.fields
        .find((field) => field.name === "course")
        ?.options.includes(selectedCourse);
      if (!courseExists) {
        setSelectedCourse("");
        setCourseFileName("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  return (
    <div className="dynamic-form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {formConfig.fields.map((field, index) => {
        // Determine if the field should be displayed based on dependencies
        let shouldDisplay = true;
        if (field.dependentFields && field.dependentFields.length > 0) {
          field.dependentFields.forEach((dependentField) => {
            const parentValue = eval(
              `selected${capitalizeFirstLetter(dependentField)}`,
            );
            if (!parentValue) {
              shouldDisplay = false;
            }
          });
        }

        return shouldDisplay ? (
          <div key={index} className="form-field">
            <Dropdown
              id={field.name}
              label={field.label}
              value={eval(`selected${capitalizeFirstLetter(field.name)}`)}
              onChange={(value) => {
                // Update the corresponding state variable
                eval(`setSelected${capitalizeFirstLetter(field.name)}(value)`);
                // Clear errors for the field
                setErrors((prev) => ({ ...prev, [field.name]: undefined }));
              }}
              options={field.options}
              defaultOption={field.defaultOption}
              disabled={false}
            />
            {errors[field.name] && (
              <ErrorMessage message={errors[field.name]} />
            )}
          </div>
        ) : null;
      })}

      <div className="flex items-center justify-between">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? <LoadingSpinner /> : "Show Course"}
        </button>
      </div>
    </div>
  );
};

export default DynamicForm;
