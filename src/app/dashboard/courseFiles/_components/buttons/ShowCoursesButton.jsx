// File: /courseFiles/_components/buttons/ShowCoursesButton.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * ShowCoursesButton component to fetch and display courses.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onClick - Callback when the button is clicked.
 * @param {boolean} props.disabled - Whether the button is disabled.
 * @returns {JSX.Element} The ShowCoursesButton component.
 */
const ShowCoursesButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      Show Courses
    </button>
  );
};

ShowCoursesButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ShowCoursesButton.defaultProps = {
  disabled: false,
};

export default ShowCoursesButton;
