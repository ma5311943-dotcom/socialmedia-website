import dbConnect from '../lib/mongodb';
import Post from '../models/Post';
import User from '../models/User';
import Notification from '../models/Notification';


import { uploadImage } from '../lib/cloudinary';


export const createPost = async (req) => {
    try {
        await dbConnect();
        const formData = await req.formData();
        const content = formData.get('content');
        const file = formData.get('image');
        const userId = formData.get('userId');

        if (!content && !file) {
            return new Response(JSON.stringify({ message: 'Post cannot be empty' }), { status: 400 });
        }

        let imageData = null;
        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
            imageData = await uploadImage(base64Image);
        }

        const post = await Post.create({
            user: userId,
            content: content || '',
            image: imageData ? imageData.url : null,
            imagePublicId: imageData ? imageData.public_id : null,
        });

        // Populate user info
        await post.populate('user', 'username profileImage');

        return new Response(JSON.stringify(post), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

export const getPosts = async () => {
    try {
        await dbConnect();
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'username profileImage')
            .populate('comments.user', 'username');

        return new Response(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

export const toggleLike = async (req) => {
    try {
        await dbConnect();
        const { postId, userId } = await req.json();

        const post = await Post.findById(postId);
        if (!post) return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();

        // Create notification for like (if not self-like)
        if (index === -1 && userId !== post.user.toString()) {
            const user = await User.findById(userId);
            await Notification.create({
                type: 'likes',
                from: userId,
                to: post.user,
                msg: 'liked your post.',
                postId: post._id
            });
        }

        return new Response(JSON.stringify(post), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

export const addComment = async (req) => {
    try {
        await dbConnect();
        const { postId, userId, text } = await req.json();

        const post = await Post.findById(postId);
        if (!post) return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });

        const comment = { user: userId, text };
        post.comments.push(comment);

        await post.save();
        await post.populate('user', 'username profileImage');
        await post.populate('comments.user', 'username');

        // Create notification for comment (if not self-comment)
        if (userId !== post.user.toString()) {
            await Notification.create({
                type: 'comments',
                from: userId,
                to: post.user,
                msg: `commented: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`,
                postId: post._id
            });
        }

        return new Response(JSON.stringify(post), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};
export const deletePost = async (req, { params }) => {
    try {
        await dbConnect();
        const { id } = await params;

        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Post deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};
