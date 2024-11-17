// File: /courseFiles/_components/dropdowns/Dropdown.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { capitalizeFirstLetter } from "../utils";

const { Option } = Select;

/**
 * Dropdown component using Ant Design's Select.
 *
 * @param {Object} props - Component props.
 * @param {string} props.id - The ID of the select element.
 * @param {string} props.label - The label for the dropdown.
 * @param {string} props.value - The current selected value.
 * @param {Function} props.onChange - Callback for value change.
 * @param {Array<string>} props.options - Array of options.
 * @param {string} props.defaultOption - Placeholder option text.
 * @param {boolean} props.disabled - Whether the dropdown is disabled.
 * @returns {JSX.Element} The Dropdown component.
 */
const Dropdown = ({
  id,
  label,
  value,
  onChange,
  options,
  defaultOption,
  disabled,
}) => {
  /**
   * Formats the option label.
   *
   * @param {string} option - The option string.
   * @returns {string} The formatted option.
   */
  const formatOptionLabel = (option) => {
    return capitalizeFirstLetter(option);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-gray-700 dark:text-gray-200 mb-1"
      >
        {label}
      </label>
      <Select
        showSearch
        value={value || undefined}
        placeholder={defaultOption}
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        onSearch={() => {}}
        className="w-full"
        disabled={disabled}
        notFoundContent={disabled ? "No options available" : "No matches found"}
        optionSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
      >
        {options.length > 0 ? (
          options.map((option) => (
            <Option key={option} value={option}>
              {formatOptionLabel(option)}
            </Option>
          ))
        ) : (
          <Option disabled>No options available</Option>
        )}
      </Select>
    </div>
  );
};

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultOption: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

Dropdown.defaultProps = {
  value: "",
  disabled: false,
};

export default Dropdown;
