import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
