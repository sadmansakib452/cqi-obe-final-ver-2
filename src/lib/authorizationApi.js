// File: /src/lib/authorizationApi.js

/**
 * @fileoverview Handles API interactions for managing authorized emails and domains.
 * Provides functions to fetch, add, and remove authorized emails and domains.
 * Designed for dynamic authorization features within the Next.js app.
 */

import axios from "axios";

/**
 * Base URL for the Authorization API.
 * Since the API is internal, use relative paths.
 */
const AUTH_API_BASE_URL = "/api/authorization";

/**
 * Fetches the list of authorized emails from the backend API.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of authorized emails.
 */
export const fetchAuthorizedEmails = async () => {
  try {
    const response = await axios.get(`${AUTH_API_BASE_URL}/emails`);
    return response.data.emails;
  } catch (error) {
    console.error("Error fetching authorized emails:", error);
    return [];
  }
};

/**
 * Fetches the list of authorized email domains from the backend API.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of authorized domains.
 */
export const fetchAuthorizedDomains = async () => {
  try {
    const response = await axios.get(`${AUTH_API_BASE_URL}/domains`);
    return response.data.domains;
  } catch (error) {
    console.error("Error fetching authorized domains:", error);
    return [];
  }
};

/**
 * Adds a new email to the authorized emails list via the backend API.
 * @param {string} email - The email address to add.
 * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
 */
export const addAuthorizedEmail = async (email) => {
  try {
    await axios.post(`${AUTH_API_BASE_URL}/emails`, { email });
    return true;
  } catch (error) {
    console.error("Error adding authorized email:", error);
    return false;
  }
};

/**
 * Removes an email from the authorized emails list via the backend API.
 * @param {string} email - The email address to remove.
 * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
 */
export const removeAuthorizedEmail = async (email) => {
  try {
    await axios.delete(`${AUTH_API_BASE_URL}/emails`, { data: { email } });
    return true;
  } catch (error) {
    console.error("Error removing authorized email:", error);
    return false;
  }
};

/**
 * Adds a new domain to the authorized domains list via the backend API.
 * @param {string} domain - The domain to add (e.g., "@example.com").
 * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
 */
export const addAuthorizedDomain = async (domain) => {
  try {
    await axios.post(`${AUTH_API_BASE_URL}/domains`, { domain });
    return true;
  } catch (error) {
    console.error("Error adding authorized domain:", error);
    return false;
  }
};

/**
 * Removes a domain from the authorized domains list via the backend API.
 * @param {string} domain - The domain to remove (e.g., "@example.com").
 * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
 */
export const removeAuthorizedDomain = async (domain) => {
  try {
    await axios.delete(`${AUTH_API_BASE_URL}/domains`, { data: { domain } });
    return true;
  } catch (error) {
    console.error("Error removing authorized domain:", error);
    return false;
  }
};
