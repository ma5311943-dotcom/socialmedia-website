import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Story from '@/models/Story';


export async function GET() {
    try {
        await dbConnect();
        // Fetch stories created in the last 24 hours, populating user info
        const stories = await Story.find()
            .populate('user', 'username profileImage')
            .sort({ createdAt: -1 });

        return NextResponse.json(stories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const { userId, media } = await req.json();

        if (!userId || !media) {
            return NextResponse.json({ message: 'User ID and media are required' }, { status: 400 });
        }

        const newStory = await Story.create({
            user: userId,
            media
        });

        return NextResponse.json(newStory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
