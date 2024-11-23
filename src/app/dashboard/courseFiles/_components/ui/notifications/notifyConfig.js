// File: /courseFiles/_components/ui/notifications/notifyConfig.js

/**
 * Configuration settings for Toastify notifications.
 */

const notifyConfig = {
  /**
   * Position of the toast on the screen.
   * Options: "left", "center", "right"
   */
  position: "center", // Top-middle placement

  /**
   * Duration in milliseconds for which the toast is visible.
   */
  duration: 3000, // 3 seconds

  /**
   * Class name for custom styling.
   */
  className: "",

  /**
   * Close button visibility.
   */
  close: true,

  /**
   * Gravity: "top" or "bottom"
   */
  gravity: "top", // Top-middle placement

  /**
   * Inline CSS for the toast.
   */
  style: {
    background: "linear-gradient(to right, #00b09b, #96c93d)",
  },
};

export default notifyConfig;
