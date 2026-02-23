const requiredEnv = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'CORS_ORIGIN'
];

export const validateEnv = () => {
    const missing = requiredEnv.filter(env => !process.env[env]);

    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }

    console.log('Environment variables validated.');
};
