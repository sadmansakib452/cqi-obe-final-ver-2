// File: src/hooks/useSignedUrl.js

import { useState } from "react";
import signedUrlCache from "@/utils/signedUrlCache";

/**
 * Custom hook to fetch and cache signed URLs.
 * @returns {Object} - An object containing the getSignedUrl function and loading state.
 */
const useSignedUrl = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Retrieves the signed URLs for a given file path, using the cache if possible.
   * @param {string} filePath - The path of the file to get the signed URLs for.
   * @returns {Promise<{ viewerUrl: string, directUrl: string } | null>} - The signed URLs or null if failed.
   */
  const getSignedUrl = async (filePath) => {
    // Check cache first
    const cachedUrls = signedUrlCache.get(filePath);
    if (cachedUrls) {
      console.log(
        `[useSignedUrl] Using cached signed URLs for file: ${filePath}`,
      );
      return cachedUrls;
    }

    // Fetch new signed URLs
    console.log(
      `[useSignedUrl] Fetching new signed URLs for file: ${filePath}`,
    );
    setLoading(true);
    try {
      const response = await fetch("/api/course/signedUrl/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch signed URLs");
      }

      const data = await response.json();
      const { viewerUrl, directUrl } = data;

      // Update cache
      signedUrlCache.set(filePath, { viewerUrl, directUrl });
      return { viewerUrl, directUrl };
    } catch (error) {
      console.error("Error fetching signed URLs:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getSignedUrl, loading };
};

export default useSignedUrl;
