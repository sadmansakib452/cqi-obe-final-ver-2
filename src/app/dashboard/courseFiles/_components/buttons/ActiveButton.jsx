// File: /courseFiles/_components/buttons/ActionButton.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * ActionButton component for form submission.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onClick - Callback when the button is clicked.
 * @param {boolean} props.disabled - Whether the button is disabled.
 * @param {string} props.label - The label for the button.
 * @returns {JSX.Element} The ActionButton component.
 */
const ActionButton = ({ onClick, disabled, label }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
};

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

ActionButton.defaultProps = {
  disabled: false,
};

export default ActionButton;
