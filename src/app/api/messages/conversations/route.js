import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';


export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        // Get all unique user IDs the current user has exchanged messages with
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        });

        const userIds = [...new Set(messages.flatMap(m => [m.sender.toString(), m.receiver.toString()]))]
            .filter(id => id !== userId);

        const conversations = await User.find({ _id: { $in: userIds } })
            .select('username profileImage role');

        return NextResponse.json(conversations, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
