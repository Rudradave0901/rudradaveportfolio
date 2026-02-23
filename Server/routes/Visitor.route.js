import express from 'express';
import {
    getVisitorStats,
    getVisitorLogs
} from '../controllers/stats.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin', 'viewer'), getVisitorStats);
router.get('/logs', protect, authorize('admin'), getVisitorLogs);

export default router;
