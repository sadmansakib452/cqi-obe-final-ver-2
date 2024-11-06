// File: src/components/DocumentViewer/DocumentViewer.jsx

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
} from "@heroicons/react/24/solid";
import { MoonLoader } from "react-spinners"; // Importing MoonLoader from react-spinners
import styles from "./DocumentViewer.module.css";

/**
 * DocumentViewer component displays the document in a responsive, full-screen popup.
 * It includes a loading spinner while the document is loading and a header with the file name.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.viewerUrl - The URL for the Google Docs Viewer iframe.
 * @param {string} props.directUrl - The direct signed URL for downloading and printing the document.
 * @param {Function} props.onClose - Function to call when closing the viewer.
 * @param {string} props.fileName - Name of the file being displayed.
 */
const DocumentViewer = ({ viewerUrl, directUrl, onClose, fileName }) => {
  // State to manage loading spinner visibility
  const [isLoading, setIsLoading] = useState(true);
  // State to handle load timeout scenarios
  const [loadTimeoutExceeded, setLoadTimeoutExceeded] = useState(false);
  // State to force iframe reload by changing key
  const [iframeKey, setIframeKey] = useState(Date.now());

  /**
   * Handles the successful load event of the iframe.
   * Sets isLoading to false and ensures loadTimeoutExceeded is reset.
   */
  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadTimeoutExceeded(false);
  };

  /**
   * useEffect hook to handle load timeout.
   * If the iframe doesn't load within 15 seconds, display an error message with a refresh option.
   */
  useEffect(() => {
    // Set a timeout for 15 seconds
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setLoadTimeoutExceeded(true);
      }
    }, 15000); // 15 seconds

    // Cleanup the timeout if the component unmounts or isLoading changes
    return () => clearTimeout(timeout);
  }, [isLoading]);

  /**
   * Handles the manual refresh action by resetting states and forcing iframe reload.
   */
  const handleRefresh = () => {
    // Reset loading states
    setIsLoading(true);
    setLoadTimeoutExceeded(false);
    // Update iframeKey to force reload
    setIframeKey(Date.now());
  };

  /**
   * Handles the download action by creating a temporary anchor element.
   */
  const handleDownload = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = directUrl;
    link.download = fileName || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Handles the print action by opening the directUrl in a new tab/window.
   */
  const handlePrint = () => {
    // Open the directUrl in a new window/tab
    const printWindow = window.open(directUrl, "_blank");
    if (printWindow) {
      printWindow.focus();
      // Note: Cannot invoke print() due to cross-origin restrictions
      // Users will need to manually trigger the print dialog
    } else {
      alert(
        "Unable to open the document for printing. Please allow pop-ups and try again.",
      );
    }
  };

  /**
   * useEffect hook to add a keyboard listener for the Esc key to close the viewer.
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listener for keydown events
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      {/* Loader Spinner using MoonLoader */}
      {isLoading && (
        <div className={styles.loaderContainer}>
          <MoonLoader color="#3498db" size={60} />
        </div>
      )}

      {/* Viewer Container */}
      <div className={styles.viewerContainer}>
        {/* Header with File Name and Action Buttons */}
        <div className={styles.header}>
          <span className={styles.fileName} title={fileName}>
            {fileName}
          </span>
          <div className={styles.actionButtons}>
            {/* Refresh Button */}
            <button
              className={styles.iconButton}
              onClick={handleRefresh}
              aria-label="Refresh Document"
              title="Refresh Document"
            >
              <ArrowPathIcon className={styles.icon} />
            </button>
            {/* Download Button */}
            <button
              className={styles.iconButton}
              onClick={handleDownload}
              aria-label="Download Document"
              title="Download Document"
            >
              <ArrowDownTrayIcon className={styles.icon} />
            </button>
            {/* Print Button */}
            <button
              className={styles.iconButton}
              onClick={handlePrint}
              aria-label="Print Document"
              title="Print Document"
            >
              <PrinterIcon className={styles.icon} />
            </button>
            {/* Close Button */}
            <button
              className={styles.iconButton}
              onClick={onClose}
              aria-label="Close Viewer"
              title="Close Viewer"
            >
              <XMarkIcon className={styles.icon} />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className={styles.documentContainer}>
          <iframe
            id="documentViewerIframe"
            key={iframeKey} // Unique key to force reload
            src={viewerUrl}
            className={styles.iframe}
            onLoad={handleIframeLoad}
            title="Document Viewer"
            allowFullScreen
          ></iframe>
        </div>

        {/* Load Timeout Message with Refresh Option */}
        {loadTimeoutExceeded && (
          <div className={styles.errorMessage}>
            <p>Document is taking longer than usual to load.</p>
            <button
              className={styles.refreshButton}
              onClick={handleRefresh}
              aria-label="Refresh Document"
            >
              <ArrowPathIcon className={styles.refreshIcon} />
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
