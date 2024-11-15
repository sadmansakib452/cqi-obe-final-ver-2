// File: /courseFiles/_components/SemesterDropdown.jsx

"use client";

import React from "react";
import { capitalizeFirstLetter } from "./utils";

/**
 * Renders a dropdown menu for selecting a semester.
 *
 * @param {Object} props - Component props.
 * @param {Array<string>} props.semesters - Array of semester strings (e.g., ["fall-24", "spring-24"]).
 * @param {string} props.selectedSemester - The currently selected semester.
 * @param {Function} props.onSelectSemester - Callback when a semester is selected.
 * @returns {JSX.Element} - The SemesterDropdown component.
 */
const SemesterDropdown = ({
  semesters,
  selectedSemester,
  onSelectSemester,
}) => {
  return (
    <div className="relative">
      <select
        id="semester"
        value={selectedSemester}
        onChange={(e) => onSelectSemester(e.target.value)}
        className="w-full border-b-2 border-gray-400 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:border-blue-500 appearance-none pr-8"
        aria-label="Select Semester"
      >
        <option value="" disabled hidden>
          Select Semester
        </option>
        {semesters.map((semester) => (
          <option key={semester} value={semester}>
            {capitalizeFirstLetter(semester)}
          </option>
        ))}
      </select>
      {/* Dropdown Icon */}
      <svg
        className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600 dark:text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
};

export default SemesterDropdown;
