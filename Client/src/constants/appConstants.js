/**
 * Application-wide constants and configuration values.
 */

export const UI_CONSTANTS = {
    // Duration to show success/error status messages (in ms)
    STATUS_MESSAGE_TIMEOUT: 5000,

    // Default scroll reveal delay
    REVEAL_DELAY: 200,
};

export const API_CONSTANTS = {
    // Base URL for API requests and static assets
    SERVER_URL: import.meta.env.VITE_SERVER_URL,

    // Request timeouts
    REQUEST_TIMEOUT: 10000,
};

export const SOCIAL_PLATFORMS = {
    GITHUB: 'GitHub',
    LINKEDIN: 'LinkedIn',
    TWITTER: 'Twitter',
    INSTAGRAM: 'Instagram',
};
