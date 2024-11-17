// File: /courseFiles/_components/dropdowns/DepartmentDropdown.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";

/**
 * DepartmentDropdown component for selecting departments.
 *
 * @param {Object} props - Component props.
 * @param {string} props.selectedDepartment - The currently selected department.
 * @param {Function} props.onSelectDepartment - Callback when a department is selected.
 * @returns {JSX.Element} The DepartmentDropdown component.
 */
const DepartmentDropdown = ({ selectedDepartment, onSelectDepartment }) => {
  const label = "Department";
  const id = "department";
  const defaultOption = "Select Department";
  const options = ["CSE", "EEE", "BBA"];

  return (
    <Dropdown
      id={id}
      label={label}
      value={selectedDepartment}
      onChange={onSelectDepartment}
      options={options}
      defaultOption={defaultOption}
      disabled={false}
    />
  );
};

DepartmentDropdown.propTypes = {
  selectedDepartment: PropTypes.string.isRequired,
  onSelectDepartment: PropTypes.func.isRequired,
};

export default DepartmentDropdown;
