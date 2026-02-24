import Message from '../models/Message.model.js';
import Visitor from '../models/Visitor.model.js';
import nodemailer from 'nodemailer';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Submit contact form
// @route   POST /api/messages
// @access  Public
export const submitMessage = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        throw new ApiError(400, 'Please provide name, email and message');
    }

    const newMessage = await Message.create({ name, email, message });

    // Send Email notification asynchronously (don't block the response)
    if (process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            family: 4,
            connectionTimeout: 5000, // Reduced timeout
            socketTimeout: 5000,
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"Portfolio Contact Form" <${process.env.SMTP_EMAIL}>`,
            to: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_EMAIL,
            subject: `New Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0891b2;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin-top: 10px;">
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            `,
        };

        // Fire and forget, catch errors internally
        transporter.sendMail(mailOptions).catch(err => {
            console.error("SMTP Error:", err.message);
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newMessage, 'Message sent successfully'));
});

// @desc    Get all messages with pagination
// @route   GET /api/messages?page=1&limit=10
// @access  Private (Admin/Viewer)
export const getMessages = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalMessages = await Message.countDocuments();
    const messages = await Message.find()
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        success: true,
        count: messages.length,
        total: totalMessages,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalMessages / limit)
        },
        data: messages,
        message: "Messages fetched successfully"
    });
});

// @desc    Update message status (e.g., mark as read)
// @route   PUT /api/messages/:id
// @access  Private (Admin)
export const updateMessageStatus = asyncHandler(async (req, res) => {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!message) {
        throw new ApiError(404, 'Message not found');
    }
    return res
        .status(200)
        .json(new ApiResponse(200, message, "Message updated successfully"));
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
export const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
        throw new ApiError(404, 'Message not found');
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, 'Message deleted successfully'));
});

// @desc    Get visitor statistics
// @route   GET /api/visitors/stats
// @access  Private (Admin/Viewer)
export const getVisitorStats = asyncHandler(async (req, res) => {
    const totalVisits = await Visitor.countDocuments();
    const uniqueIPs = (await Visitor.distinct('ip')).length;

    // Visits in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentVisits = await Visitor.countDocuments({ timestamp: { $gte: twentyFourHoursAgo } });

    // Get last 10 logs
    const logs = await Visitor.find().sort('-timestamp').limit(10);

    return res.status(200).json(new ApiResponse(200, {
        totalVisits,
        uniqueIPs,
        recentVisits,
        logs
    }, "Visitor stats fetched successfully"));
});

// @desc    Get all visitor logs with pagination
// @route   GET /api/visitors?page=1&limit=50
// @access  Private (Admin)
export const getVisitorLogs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const totalVisitors = await Visitor.countDocuments();
    const visitors = await Visitor.find()
        .sort('-timestamp')
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        success: true,
        total: totalVisitors,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalVisitors / limit)
        },
        data: visitors,
        message: "Visitor logs fetched successfully"
    });
});
