// File: /courseFiles/_components/ui/notifications/notify.js

/**
 * Notification functions using Toastify.js
 */

import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import notifyConfig from "./notifyConfig";
import "./notify.css";


/**
 * Displays an error notification.
 *
 * @param {string} message - The error message to display.
 */
export const notifyError = (message) => {
  Toastify({
    text: message,
    gravity: notifyConfig.gravity,
    position: notifyConfig.position,
    duration: notifyConfig.duration,
    close: notifyConfig.close,
    className: "toastify-error",
    style: {
      background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      ...notifyConfig.style,
    },
  }).showToast();
};

/**
 * Displays a warning notification.
 *
 * @param {string} message - The warning message to display.
 */
export const notifyWarning = (message) => {
  Toastify({
    text: message,
    gravity: notifyConfig.gravity,
    position: notifyConfig.position,
    duration: notifyConfig.duration,
    close: notifyConfig.close,
    className: "toastify-warning",
    style: {
      background: "linear-gradient(to right, #f7971e, #ffd200)",
      ...notifyConfig.style,
    },
  }).showToast();
};

/**
 * Displays an information notification.
 *
 * @param {string} message - The information message to display.
 */
export const notifyInfo = (message) => {
  Toastify({
    text: message,
    gravity: notifyConfig.gravity,
    position: notifyConfig.position,
    duration: notifyConfig.duration,
    close: notifyConfig.close,
    className: "toastify-info",
    style: {
      background: "linear-gradient(to right, #2193b0, #6dd5ed)",
      ...notifyConfig.style,
    },
  }).showToast();
};
