// File: /courseFiles/_components/ui/Loader.jsx

"use client";

import React from "react";

/**
 * Loader component to indicate ongoing processes.
 *
 * @returns {JSX.Element} The Loader component.
 */
const Loader = () => {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
