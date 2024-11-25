// File: /src/lib/emailValidator.js

/**
 * @fileoverview Utility functions for validating emails and domains.
 * Ensures that user emails meet the authorization criteria.
 */

/**
 * Determines if an email is allowed based on authorized emails and domains.
 * @param {string} email - The user's email address.
 * @param {Array<string>} allowedEmails - List of specific authorized emails.
 * @param {Array<string>} allowedDomains - List of authorized email domains.
 * @returns {boolean} True if the email is allowed, false otherwise.
 */
export const isEmailAllowed = (email, allowedEmails, allowedDomains) => {
  if (!email) return false;

  const emailLower = email.toLowerCase();

  // Check if the email is in the allowed emails list
  const isSpecificEmailAllowed = allowedEmails
    .map((e) => e.toLowerCase())
    .includes(emailLower);

  if (isSpecificEmailAllowed) return true;

  // Check if the email ends with any of the allowed domains
  const isDomainAllowed = allowedDomains.some((domain) =>
    emailLower.endsWith(domain.toLowerCase()),
  );

  return isDomainAllowed;
};
