// File: /courseFiles/_components/ui/select.jsx

"use client";

import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormLabel,
  Select,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

/**
 * SelectRoot component that wraps the FormControl and Select.
 *
 * @param {Object} props - Component props.
 * @param {string} props.label - The label for the select.
 * @param {string} props.value - The selected value.
 * @param {Function} props.onChange - Callback when the value changes.
 * @param {Array<Object>} props.options - Array of option objects with 'label' and 'value'.
 * @param {boolean} props.clearable - Whether to show the clear button.
 * @param {string} props.placeholder - Placeholder text.
 * @returns {JSX.Element} The SelectRoot component.
 */
export const SelectRoot = ({
  label,
  value,
  onChange,
  options,
  clearable,
  placeholder,
}) => {
  const handleClear = () => {
    onChange("");
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          bg="white"
          _focus={{ borderColor: "blue.500" }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {clearable && value && (
          <InputRightElement>
            <IconButton
              aria-label="Clear selection"
              icon={<CloseIcon />}
              size="sm"
              onClick={handleClear}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};

SelectRoot.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  clearable: PropTypes.bool,
  placeholder: PropTypes.string,
};

SelectRoot.defaultProps = {
  clearable: false,
  placeholder: "",
};

export default SelectRoot;
