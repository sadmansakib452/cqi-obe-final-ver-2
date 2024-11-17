// File: /components/ErrorMessage.jsx

import React from "react";

/**
 * ErrorMessage component for displaying validation errors.
 *
 * @param {Object} props - The component props.
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element} - The rendered error message component.
 */
const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message text-red-500 text-sm mt-1">{message}</div>
  );
};

export default ErrorMessage;
