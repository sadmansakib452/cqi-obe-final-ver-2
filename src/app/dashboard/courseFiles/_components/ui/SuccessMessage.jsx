// File: /courseFiles/_components/ui/SuccessMessage.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * SuccessMessage component to display success messages.
 *
 * @param {Object} props - Component props.
 * @param {string} props.message - The success message to display.
 * @returns {JSX.Element} The SuccessMessage component.
 */
const SuccessMessage = ({ message }) => {
  return <p className="text-green-500 text-sm mt-1">{message}</p>;
};

SuccessMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default SuccessMessage;
