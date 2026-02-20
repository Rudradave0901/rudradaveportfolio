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
        default: Date.now
    }
}, {
    timestamps: true
});

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
