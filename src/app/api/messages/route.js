import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';


// GET messages between two users
export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const senderId = searchParams.get('senderId');
        const receiverId = searchParams.get('receiverId');

        if (!senderId || !receiverId) {
            return NextResponse.json({ message: 'Both sender and receiver IDs are required' }, { status: 400 });
        }

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST a new message
export async function POST(req) {
    try {
        await dbConnect();
        const { senderId, receiverId, content } = await req.json();

        if (!senderId || !receiverId || !content) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content
        });

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
