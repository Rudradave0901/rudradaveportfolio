import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import AuthService from "../services/Auth.service.js";

// @desc    Register user
export const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const user = await AuthService.registerUser({
        username,
        email,
        password,
        role: "viewer", // Force viewer role for self-registration
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide an email and password");
    }

    const user = await AuthService.loginUser(email, password);

    sendTokenResponse(user, 200, res);
});

// @desc    Logout user / clear cookie
export const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Logged out successfully"));
});

// @desc    Get current logged in user
export const getMe = asyncHandler(async (req, res) => {
    const user = await AuthService.getUserById(req.user.id);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

// Helper to create token and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = AuthService.generateToken(user._id);
    const options = AuthService.getCookieOptions();

    res
        .status(statusCode)
        .cookie("token", token, options)
        .json(new ApiResponse(statusCode, {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        }, statusCode === 201 ? "User registered successfully" : "Logged in successfully"));
};
