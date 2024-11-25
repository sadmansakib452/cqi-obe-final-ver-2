// File: /src/lib/authorization.js

/**
 * @fileoverview Central module for handling authorization logic.
 * Determines whether a user's email is authorized to sign in.
 * Integrates both static and dynamic (API-based) authorization methods.
 */

import {
  STATIC_ALLOWED_EMAILS,
  STATIC_ALLOWED_DOMAINS,
} from "./staticAuthorization";
import {
  fetchAuthorizedEmails,
  fetchAuthorizedDomains,
} from "./authorizationApi";
import { isEmailAllowed } from "./emailValidator";
import { DEV_USE_DYNAMIC_AUTHORIZATION } from "./devConfig";

/**
 * Configuration flag to determine whether to use dynamic authorization via API.
 * Priority:
 * 1. Environment Variable: USE_DYNAMIC_AUTHORIZATION
 * 2. Developer Testing Variable: DEV_USE_DYNAMIC_AUTHORIZATION
 * Default: false
 */
const USE_DYNAMIC_AUTHORIZATION =
  process.env.USE_DYNAMIC_AUTHORIZATION === "true" ||
  DEV_USE_DYNAMIC_AUTHORIZATION;

/**
 * Retrieves the list of authorized emails.
 * Uses dynamic API-based data if enabled; otherwise, falls back to static data.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of authorized emails.
 */
const getAuthorizedEmails = async () => {
  if (USE_DYNAMIC_AUTHORIZATION) {
    const emails = await fetchAuthorizedEmails();
    return emails.length > 0 ? emails : STATIC_ALLOWED_EMAILS;
  }
  return STATIC_ALLOWED_EMAILS;
};

/**
 * Retrieves the list of authorized email domains.
 * Uses dynamic API-based data if enabled; otherwise, falls back to static data.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of authorized domains.
 */
const getAuthorizedDomains = async () => {
  if (USE_DYNAMIC_AUTHORIZATION) {
    const domains = await fetchAuthorizedDomains();
    return domains.length > 0 ? domains : STATIC_ALLOWED_DOMAINS;
  }
  return STATIC_ALLOWED_DOMAINS;
};

/**
 * Determines if a user's email is authorized based on allowed emails and domains.
 * @param {string} email - The user's email address.
 * @returns {Promise<boolean>} A promise that resolves to true if authorized, false otherwise.
 */
export const authorizeEmail = async (email) => {
  const [authorizedEmails, authorizedDomains] = await Promise.all([
    getAuthorizedEmails(),
    getAuthorizedDomains(),
  ]);

  return isEmailAllowed(email, authorizedEmails, authorizedDomains);
};
