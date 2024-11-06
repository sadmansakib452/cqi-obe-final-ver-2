// File: src/utils/signedUrlCache.js

import { MINIO_FILE_EXPIARY_TIME } from "@/config";

/**
 * Singleton class to handle caching of signed URLs.
 */
class SignedUrlCache {
  constructor() {
    this.cache = new Map();
    this.expiryTime = parseInt(MINIO_FILE_EXPIARY_TIME, 10) * 1000; // Convert seconds to milliseconds
    this.timeBuffer = 60 * 1000; // 1-minute buffer in milliseconds
  }

  /**
   * Retrieves a signed URL from the cache if it's still valid.
   * @param {string} filePath - The file path used as the key.
   * @returns {string|null} - The signed URL or null if not found or expired.
   */
  get(filePath) {
    const entry = this.cache.get(filePath);
    if (entry && Date.now() < entry.expiryTimestamp) {
      console.log(`[SignedUrlCache] Cache hit for file: ${filePath}`);
      return entry.viewerUrl;
    }
    if (entry) {
      console.log(`[SignedUrlCache] Cache expired for file: ${filePath}`);
      this.cache.delete(filePath); // Remove expired entry
    } else {
      console.log(`[SignedUrlCache] Cache miss for file: ${filePath}`);
    }
    return null;
  }

  /**
   * Stores a signed URL in the cache with its expiration time.
   * @param {string} filePath - The file path used as the key.
   * @param {string} viewerUrl - The signed URL to store.
   */
  set(filePath, viewerUrl) {
    const expiryTimestamp = Date.now() + this.expiryTime - this.timeBuffer; // Adjust for time skew
    this.cache.set(filePath, { viewerUrl, expiryTimestamp });
    console.log(
      `[SignedUrlCache] Cached signed URL for file: ${filePath} (Expires at: ${new Date(expiryTimestamp).toISOString()})`,
    );
  }

  /**
   * Returns the current cache state (for debugging purposes).
   * @returns {Map} - The cache map.
   */
  getCache() {
    return this.cache;
  }
}

const signedUrlCache = new SignedUrlCache();
export default signedUrlCache;
