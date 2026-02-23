import express from "express";
import {
    register,
    login,
    logout,
    getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

import { registerValidator, loginValidator, validate } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/register", validate(registerValidator), register);
router.post("/login", validate(loginValidator), login);
router.get("/logout", logout);
router.get("/me", protect, getMe);

export default router;
