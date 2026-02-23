/**
 * Validates an email address.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Validates if a string is a valid URL.
 * @param {string} url
 * @returns {boolean}
 */
export const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};

/**
 * Truncates a string to a specified length.
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export const truncateString = (str, length = 100) => {
    if (!str) return "";
    return str.length > length ? str.substring(0, length) + "..." : str;
};
