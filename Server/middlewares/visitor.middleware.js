import Visitor from '../models/Visitor.model.js';

export const trackVisitor = async (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        // Optionally: Deduplicate visits from same IP within a short timeframe (e.g., 1 hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const existingVisit = await Visitor.findOne({
            ip,
            timestamp: { $gte: oneHourAgo }
        });

        if (!existingVisit) {
            await Visitor.create({
                ip,
                userAgent
            });
        }

        next();
    } catch (error) {
        console.error('Visitor tracking error:', error);
        next(); // Don't block the request if tracking fails
    }
};
