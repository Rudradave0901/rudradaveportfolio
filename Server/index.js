import express from "express";
import { connectDB } from "./config/dbConnection.js";
import { app } from "./app.js";

// CONNECT DB AND THEN AFTER START LISTENING
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on https//localhost:${process.env.PORT}`);
    });
});
