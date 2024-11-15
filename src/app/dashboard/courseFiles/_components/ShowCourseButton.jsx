// File: /courseFiles/_components/ShowCourseButton.jsx

"use client";

import React from "react";

/**
 * Renders a button to show the selected course's upload table.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onClick - Callback when the button is clicked.
 * @param {boolean} props.disabled - Whether the button is disabled.
 * @returns {JSX.Element} - The ShowCourseButton component.
 */
const ShowCourseButton = ({ onClick, disabled }) => {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full px-4 py-2 bg-green-200 text-green-800 rounded-md shadow-sm hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Show Course
      </button>
    </div>
  );
};

export default ShowCourseButton;
