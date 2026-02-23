import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

class AuthService {
    async registerUser(userData) {
        return await User.create(userData);
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new ApiError(401, "Invalid credentials");
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            throw new ApiError(401, "Invalid credentials");
        }

        return user;
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    }

    getCookieOptions() {
        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };

        return options;
    }
}

export default new AuthService();
