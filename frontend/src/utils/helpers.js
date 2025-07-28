// src/utils/helpers.js

/**
 * Generates a random alphanumeric shortcode.
 * @param {number} length The desired length of the shortcode. Defaults to 6.
 * @returns {string} The generated shortcode.
 */
export function generateShortcode(length = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Logs an event to the console (and potentially other logging services in a real app).
 * @param {string} message The message to log.
 * @param {string} level The log level (e.g., "info", "warn", "error").
 */
export function logEvent(message, level = "info") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  // In a real application, you might send this to a backend logging service
}