// File: /courseFiles/_components/CourseDropdown.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * Renders a dropdown menu for selecting a course.
 *
 * @param {Object} props - Component props.
 * @param {Array<string>} props.courses - Array of course file names (e.g., ["2024.3.CSE101-1"]).
 * @param {string} props.selectedCourse - The currently selected course.
 * @param {Function} props.onSelectCourse - Callback when a course is selected.
 * @returns {JSX.Element} The CourseDropdown component.
 */
const CourseDropdown = ({ courses, selectedCourse, onSelectCourse }) => {
  return (
    <div>
      <select
        id="course"
        value={selectedCourse}
        onChange={(e) => onSelectCourse(e.target.value)}
        className="w-full border-b-2 border-gray-400 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-300 text-sm focus:outline-none focus:border-blue-500 appearance-none pr-8"
        aria-label="Select Course"
      >
        <option value="" disabled hidden>
          Select Course
        </option>
        {courses.map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>
    </div>
  );
};

CourseDropdown.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCourse: PropTypes.string.isRequired,
  onSelectCourse: PropTypes.func.isRequired,
};

export default CourseDropdown;
