// File: /courseFiles/_components/dropdowns/CourseDropdown.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";

/**
 * CourseDropdown component for selecting courses.
 *
 * @param {Object} props - Component props.
 * @param {Array<string>} props.courses - Array of course options.
 * @param {string} props.selectedCourse - The currently selected course.
 * @param {Function} props.onSelectCourse - Callback when a course is selected.
 * @returns {JSX.Element} The CourseDropdown component.
 */
const CourseDropdown = ({ courses, selectedCourse, onSelectCourse }) => {
  const label = "Course";
  const id = "course";
  const defaultOption = "Select Course";
  const options = courses;

  return (
    <Dropdown
      id={id}
      label={label}
      value={selectedCourse}
      onChange={onSelectCourse}
      options={options}
      defaultOption={defaultOption}
      disabled={courses.length === 0}
    />
  );
};

CourseDropdown.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCourse: PropTypes.string.isRequired,
  onSelectCourse: PropTypes.func.isRequired,
};

export default CourseDropdown;
