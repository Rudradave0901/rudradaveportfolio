import Message from '../models/Message.model.js';
import Visitor from '../models/Visitor.model.js';
import nodemailer from 'nodemailer';

// @desc    Submit contact form
// @route   POST /api/messages
// @access  Public
export const submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please provide name, email and message' });
        }

        const newMessage = await Message.create({ name, email, message });

        // Optional: Send Email notification via SMTP
        if (process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_PORT == 465,
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: `"Portfolio Contact Form" <${process.env.SMTP_EMAIL}>`,
                to: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_EMAIL,
                subject: `New Message from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
                html: `
                    <h3>New Contact Form Submission</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `,
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({ success: true, data: newMessage, message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin/Viewer)
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort('-createdAt');
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update message status (e.g., mark as read)
// @route   PUT /api/messages/:id
// @access  Private (Admin)
export const updateMessageStatus = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
export const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get visitor statistics
// @route   GET /api/visitors/stats
// @access  Private (Admin/Viewer)
export const getVisitorStats = async (req, res) => {
    try {
        const totalVisits = await Visitor.countDocuments();
        const uniqueIPs = (await Visitor.distinct('ip')).length;

        // Visits in last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentVisits = await Visitor.countDocuments({ timestamp: { $gte: twentyFourHoursAgo } });

        // Get last 10 logs
        const logs = await Visitor.find().sort('-timestamp').limit(10);

        res.status(200).json({
            success: true,
            data: {
                totalVisits,
                uniqueIPs,
                recentVisits,
                logs
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all visitor logs
// @route   GET /api/visitors
// @access  Private (Admin)
export const getVisitorLogs = async (req, res) => {
    try {
        const visitors = await Visitor.find().sort('-timestamp').limit(100);
        res.status(200).json({ success: true, data: visitors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
