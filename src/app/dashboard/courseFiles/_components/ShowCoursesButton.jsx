// File: /courseFiles/_components/ShowCoursesButton.jsx

"use client";

import React from "react";

/**
 * Renders a button to show courses based on the selected semester.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onClick - Callback when the button is clicked.
 * @param {boolean} props.disabled - Whether the button is disabled.
 * @returns {JSX.Element} - The ShowCoursesButton component.
 */
const ShowCoursesButton = ({ onClick, disabled }) => {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full px-4 py-2 bg-blue-200 text-blue-800 rounded-md shadow-sm hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Show Courses
      </button>
    </div>
  );
};

export default ShowCoursesButton;
