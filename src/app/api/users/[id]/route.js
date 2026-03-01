import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';
import { deleteUser } from '@/controllers/userController';

export async function GET(req, { params }) {
    try {
        await dbConnect();

        // Ensure params are destructured correctly in Next.js 15
        const paramsData = await params;
        const userId = paramsData.id;

        if (!userId) {
            return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Fetch actual posts for this user to calculate real stats
        const userPosts = await Post.find({ user: userId });

        // Calculate interactions (likes on user's posts)
        const totalLikes = userPosts.reduce((acc, post) => acc + post.likes.length, 0);

        const profileData = {
            ...user.toObject(),
            stats: {
                followers: user.followers?.length || 0,
                following: user.following?.length || 0,
                totalPosts: userPosts.length,
                totalInteractions: totalLikes
            },
            posts: userPosts // Return real posts data
        };

        return new Response(JSON.stringify(profileData), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    return await deleteUser(req, { params });
}
