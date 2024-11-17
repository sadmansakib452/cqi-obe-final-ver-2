// File: /courseFiles/_components/ui/ErrorMessage.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * ErrorMessage component to display error messages.
 *
 * @param {Object} props - Component props.
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element} The ErrorMessage component.
 */
const ErrorMessage = ({ message }) => {
  return <p className="text-red-500 text-sm mt-1">{message}</p>;
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
