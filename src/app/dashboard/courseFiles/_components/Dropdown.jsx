// File: /components/Dropdown.jsx

import React from "react";

/**
 * Dropdown component for rendering select fields.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the dropdown.
 * @param {string} props.label - The label for the dropdown.
 * @param {string} props.value - The current value of the dropdown.
 * @param {Function} props.onChange - The change handler function.
 * @param {Array<string>} props.options - The options to display.
 * @param {string} props.defaultOption - The default placeholder option.
 * @param {boolean} props.disabled - Whether the dropdown is disabled.
 * @returns {JSX.Element} - The rendered dropdown component.
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
  return (
    <div className="dropdown-container mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={label}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="" disabled hidden>
          {defaultOption}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
