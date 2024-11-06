import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


// File: /src/lib/utils.js

// Helper function to fetch dynamic course file names
export function fetchDynamicCourseFileNames(courseFiles) {
  return courseFiles.map(file => ({
    key: file.courseFileName,
    label: file.courseFileName,
  }));
}

// File: /src/lib/utils.js

// Helper function to handle viewing file by generating signed URL
export async function handleViewFile(filePath) {
  try {
    const response = await fetch("/api/course/signedUrl/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }), // Send filePath in the request body
    });

    if (!response.ok) {
      throw new Error("Failed to generate signed URL");
    }

    const data = await response.json();
    return data.signedUrl; // Return the signed URL
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
}

