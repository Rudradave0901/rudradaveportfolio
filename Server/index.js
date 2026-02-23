import "dotenv/config.js";
import express from "express";
import { connectDB } from "./config/dbConnection.js";
import { validateEnv } from "./config/envValidator.js";
import { app } from "./app.js";

// Validate environment variables
validateEnv();

// CONNECT DB AND THEN AFTER START LISTENING
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
});
