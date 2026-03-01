import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';


export async function POST(req) {
    try {
        await dbConnect();
        const { rating, comment, userId } = await req.json();

        if (!rating || !comment) {
            return NextResponse.json({ message: 'Rating and comment are required' }, { status: 400 });
        }

        const feedback = await Feedback.create({
            rating,
            comment,
            user: userId || null // Optional if user is not logged in
        });

        return NextResponse.json({ message: 'Feedback submitted successfully', feedback }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
