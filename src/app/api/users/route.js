import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { toggleUserRole } from '@/controllers/userController';

export async function GET(req) {
    try {
        await dbConnect();

        // Get search params for limit/filter if needed
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 20;

        // Fetch users (excluding passwords and email for privacy in general list)
        const users = await User.find({})
            .limit(limit)
            .select('-password -email')
            .sort({ createdAt: -1 });

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function PATCH(req) {
    return await toggleUserRole(req);
}
