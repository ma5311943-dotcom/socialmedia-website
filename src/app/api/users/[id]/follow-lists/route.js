import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const paramsData = await params;
        const userId = paramsData.id;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const user = await User.findById(userId)
            .populate('followers', 'username profileImage role')
            .populate('following', 'username profileImage role');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            followers: user.followers,
            following: user.following
        });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
