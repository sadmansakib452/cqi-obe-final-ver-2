// File: /courseFiles/_components/buttons/ShowCourseButton.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * ShowCourseButton component to fetch and display course file data.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onClick - Callback when the button is clicked.
 * @param {boolean} props.disabled - Whether the button is disabled.
 * @returns {JSX.Element} The ShowCourseButton component.
 */
const ShowCourseButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      Show Course
    </button>
  );
};

ShowCourseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ShowCourseButton.defaultProps = {
  disabled: false,
};

export default ShowCourseButton;
