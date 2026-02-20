import express from 'express';
import {
    submitMessage,
    getMessages,
    updateMessageStatus,
    deleteMessage
} from '../controllers/stats.controller.js';
import { protect, authorize } from '../middleweres/auth.middleware.js';

const router = express.Router();

router.post('/', submitMessage);
router.get('/', protect, authorize('admin', 'viewer'), getMessages);
router.put('/:id', protect, authorize('admin'), updateMessageStatus);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

export default router;
