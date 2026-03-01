import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportMessage from '@/models/SupportMessage';


export async function POST(req) {
    try {
        await dbConnect();
        const { message, userId } = await req.json();

        if (!message) {
            return NextResponse.json({ message: 'Message is required' }, { status: 400 });
        }

        const supportMsg = await SupportMessage.create({
            message,
            user: userId || null
        });

        return NextResponse.json({ message: 'Message sent successfully', supportMsg }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
