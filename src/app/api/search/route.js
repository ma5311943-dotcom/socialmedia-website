import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';


export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return new Response(JSON.stringify({ users: [], posts: [] }), { status: 200 });
        }

        const regex = new RegExp(query, 'i');

        const [users, posts] = await Promise.all([
            User.find({ username: regex }).limit(10).select('-password -email'),
            Post.find({ content: regex }).limit(10).populate('user', 'username profileImage')
        ]);

        return new Response(JSON.stringify({ users, posts }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
