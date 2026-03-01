import mongoose from 'mongoose';

const SupportMessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'replied', 'closed'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.models.SupportMessage || mongoose.model('SupportMessage', SupportMessageSchema);
