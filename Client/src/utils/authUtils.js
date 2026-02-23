/**
 * Checks if the user has admin privileges.
 * @param {Object} user - The user object from context.
 * @returns {boolean}
 */
export const isAdmin = (user) => {
    return user?.role === "admin";
};

/**
 * Checks if the user has at least viewer privileges.
 * @param {Object} user - The user object from context.
 * @returns {boolean}
 */
export const isViewer = (user) => {
    return user?.role === "viewer" || user?.role === "admin";
};
