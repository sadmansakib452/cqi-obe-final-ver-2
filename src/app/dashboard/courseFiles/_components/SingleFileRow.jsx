// File: src/app/dashboard/courseFiles/_components/SingleFileRow.jsx

"use client";

import React from "react";
import {
  EyeIcon,
  ArrowPathIcon,
  TrashIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

/**
 * Checks if a file is viewable based on its extension.
 *
 * @param {string} filePath - The path of the file.
 * @returns {boolean} - True if the file is viewable, else false.
 */
const isViewable = (filePath) => {
  const viewableExtensions = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".bmp",
  ];
  return viewableExtensions.some((ext) => filePath.toLowerCase().endsWith(ext));
};

/**
 * Renders a table row for a single file item.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.row - The row data.
 * @param {number} props.index - The index of the row.
 * @param {Function} props.handleViewFile - Function to handle viewing files.
 * @param {Function} props.openUploadDialog - Function to open upload dialogs.
 * @param {boolean} props.loading - Loading state.
 * @returns {JSX.Element} - The table row element.
 */
const SingleFileRow = ({
  row,
  index,
  handleViewFile,
  openUploadDialog,
  loading,
}) => (
  <tr
    className={`${
      index % 2 === 0
        ? "bg-gray-50 dark:bg-gray-800"
        : "bg-white dark:bg-gray-700"
    }`}
  >
    {/* Item Name */}
    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 w-1/3">
      {row.item}
    </td>
    {/* Status */}
    <td className="px-6 py-4 w-1/3">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === "Uploaded"
            ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200"
        }`}
      >
        {row.status}
      </span>
    </td>
    {/* Actions */}
    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 w-1/3">
      <div className="flex space-x-4">
        {row.path ? (
          <>
            {/* View Button */}
            {isViewable(row.path) && (
              <button
                onClick={() => handleViewFile(row.path, row.item)}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                title="View"
                disabled={loading}
              >
                <EyeIcon className="h-5 w-5" />
              </button>
            )}
            {/* Re-upload Button */}
            <button
              onClick={() => openUploadDialog(row.step)} // Only step is needed
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              title="Re-upload"
              disabled={loading}
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            {/* Delete Button */}
            <button
              onClick={() =>
                alert(
                  `Delete functionality for ${row.item} is not implemented yet.`,
                )
              }
              className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
              title="Delete"
              disabled
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </>
        ) : (
          // Upload Button
          <button
            onClick={() => openUploadDialog(row.step)} // Only step is needed
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            title="Upload"
            disabled={loading}
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </td>
  </tr>
);

// PropTypes for type checking
SingleFileRow.propTypes = {
  row: PropTypes.shape({
    item: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    path: PropTypes.string,
    step: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  handleViewFile: PropTypes.func.isRequired,
  openUploadDialog: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SingleFileRow;
