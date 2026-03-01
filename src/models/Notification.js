import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['likes', 'comments', 'alerts', 'follows'],
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
