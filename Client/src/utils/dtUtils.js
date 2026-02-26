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

/**
 * Sorts an array of objects by a date field in descending order (newest first).
 * Handles 'startDate', 'year', 'date', etc.
 * @param {Array} items - The array to sort.
 * @param {string} dateField - The field to use for sorting (default: 'startDate').
 * @returns {Array} - Sorted array.
 */
export const sortItemsByDate = (items, dateField = 'startDate') => {
    if (!items || !Array.isArray(items)) return [];

    const parseDate = (dateVal) => {
        if (!dateVal) return 0;
        const str = dateVal.toString().toLowerCase().trim();
        if (str === 'present' || str === 'current') return new Date().getTime();

        // Handle numeric years specifically (e.g. 2023)
        if (/^\d{4}$/.test(str)) return new Date(str, 0, 1).getTime();

        const date = new Date(dateVal);
        return isNaN(date.getTime()) ? 0 : date.getTime();
    };

    return [...items].sort((a, b) => {
        const timeA = parseDate(a[dateField]);
        const timeB = parseDate(b[dateField]);

        // If start dates are equal, sort by end date if available
        if (timeB === timeA && a.endDate && b.endDate) {
            const endTimeA = parseDate(a.endDate);
            const endTimeB = parseDate(b.endDate);
            return endTimeB - endTimeA;
        }

        return timeB - timeA;
    });
};
