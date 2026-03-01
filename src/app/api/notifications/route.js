import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import User from '@/models/User';

function getRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
}

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const notifications = await Notification.find({ to: userId })
            .sort({ createdAt: -1 })
            .populate('from', 'username profileImage')
            .limit(20);

        // Format for the UI
        const formatted = notifications.map(n => ({
            id: n._id,
            type: n.type,
            from: n.from?.username || 'System',
            msg: n.msg,
            time: getRelativeTime(new Date(n.createdAt)),
            read: n.read,
            color: n.type === 'likes' ? 'text-emerald-400' : n.type === 'comments' ? 'text-blue-400' : n.type === 'follows' ? 'text-purple-400' : 'text-amber-500'
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const userId = searchParams.get('userId');

        if (id) {
            await Notification.findByIdAndUpdate(id, { read: true });
        } else if (userId) {
            await Notification.updateMany({ to: userId }, { read: true });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
