// File: /courseFiles/_components/dropdowns/SemesterDropdown.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";

/**
 * SemesterDropdown component for selecting semesters.
 *
 * @param {Object} props - Component props.
 * @param {Array<string>} props.semesters - Array of semester options.
 * @param {string} props.selectedSemester - The currently selected semester.
 * @param {Function} props.onSelectSemester - Callback when a semester is selected.
 * @returns {JSX.Element} The SemesterDropdown component.
 */
const SemesterDropdown = ({
  semesters,
  selectedSemester,
  onSelectSemester,
}) => {
  const label = "Semester";
  const id = "semester";
  const defaultOption = "Select Semester";
  const options = semesters;

  return (
    <Dropdown
      id={id}
      label={label}
      value={selectedSemester}
      onChange={onSelectSemester}
      options={options}
      defaultOption={defaultOption}
      disabled={semesters.length === 0}
    />
  );
};

SemesterDropdown.propTypes = {
  semesters: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSemester: PropTypes.string.isRequired,
  onSelectSemester: PropTypes.func.isRequired,
};

export default SemesterDropdown;
