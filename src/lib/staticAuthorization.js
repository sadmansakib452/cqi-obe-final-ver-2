// File: /src/lib/staticAuthorization.js

/**
 * @fileoverview Contains static lists of authorized emails and domains.
 * Used when dynamic authorization via API is disabled.
 */

/**
 * List of specific email addresses authorized to access the application.
 * @type {Array<string>}
 */
export const STATIC_ALLOWED_EMAILS = [
  "sadmansakib452@gmail.com",
  // Add more specific emails as needed
];

/**
 * List of authorized email domain suffixes.
 * Users with emails ending with these domains are authorized.
 * @type {Array<string>}
 */
export const STATIC_ALLOWED_DOMAINS = [
  
  "@ewubd.edu",
  // Add more approved domains as needed
];
