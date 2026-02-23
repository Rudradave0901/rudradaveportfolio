/**
 * Formats a date string or object into a human-readable format.
 * @param {string|Date} date - The date to format.
 * @param {Object} options - Intl.DateTimeFormat options.
 * @returns {string} - Formatted date string.
 */
export const formatDate = (date, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(undefined, options);
};

/**
 * Returns a relative time string (e.g., "2 hours ago").
 * @param {string|Date} date - The date to format.
 * @returns {string} - Relative time string.
 */
export const getRelativeTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return formatDate(date);
};

/**
 * Returns the current year.
 * @returns {number}
 */
export const getCurrentYear = () => {
    return new Date().getFullYear();
};
