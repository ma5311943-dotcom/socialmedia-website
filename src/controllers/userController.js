import dbConnect from '../lib/mongodb';
import User from '../models/User';
import Post from '../models/Post';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { uploadImage } from '../lib/cloudinary';
import Notification from '../models/Notification';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
        expiresIn: '60m',
    });
};

const setAuthCookie = async (token) => {
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        sameSite: 'strict',
        path: '/',
    });
};

export const registerUser = async (req) => {
    try {
        await dbConnect();
        const { username, email, password } = await req.json();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return new Response(JSON.stringify({ message: 'User already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            const token = generateToken(user._id);
            await setAuthCookie(token);

            return new Response(
                JSON.stringify({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: token,
                }),
                {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        } else {
            return new Response(JSON.stringify({ message: 'Invalid user data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const loginUser = async (req) => {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            await setAuthCookie(token);

            return new Response(
                JSON.stringify({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: token,
                }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        } else {
            return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const getProfile = async (req) => {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ message: 'User ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await User.findById(id).select('-password');
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const toggleFollow = async (req) => {
    try {
        await dbConnect();
        const { userId, targetId } = await req.json();

        if (userId === targetId) {
            return new Response(JSON.stringify({ message: 'Cannot follow yourself' }), { status: 400 });
        }

        const user = await User.findById(userId);
        const target = await User.findById(targetId);

        if (!user || !target) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        const isFollowing = user.following.includes(targetId);

        if (isFollowing) {
            user.following = user.following.filter(id => id.toString() !== targetId);
            target.followers = target.followers.filter(id => id.toString() !== userId);
        } else {
            user.following.push(targetId);
            target.followers.push(userId);

            // Create follow notification
            await Notification.create({
                type: 'follows',
                from: userId,
                to: targetId,
                msg: 'started following you.'
            });
        }

        await user.save();
        await target.save();

        return new Response(JSON.stringify({ isFollowing: !isFollowing }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

export const updateProfile = async (req) => {
    try {
        await dbConnect();
        const { id, username, bio, profileImage, coverImage } = await req.json();

        const user = await User.findById(id);
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        if (username) user.username = username;
        if (bio !== undefined) user.bio = bio;

        if (profileImage && profileImage.startsWith('data:')) {
            const uploaded = await uploadImage(profileImage);
            user.profileImage = uploaded.url;
        } else if (profileImage) {
            user.profileImage = profileImage;
        }

        if (coverImage && coverImage.startsWith('data:')) {
            const uploaded = await uploadImage(coverImage);
            user.coverImage = uploaded.url;
        } else if (coverImage) {
            user.coverImage = coverImage;
        }

        await user.save();

        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
            role: user.role
        };

        return new Response(JSON.stringify(userData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const deleteUser = async (req, { params }) => {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Also delete user's posts
        await Post.deleteMany({ user: id });

        return new Response(JSON.stringify({ message: 'User and their posts deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

export const toggleUserRole = async (req) => {
    try {
        await dbConnect();
        const { id } = await req.json();

        const user = await User.findById(id);
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

export const updateSettings = async (req) => {
    try {
        await dbConnect();
        const { id, settings } = await req.json();

        const user = await User.findById(id);
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        user.settings = { ...user.settings, ...settings };
        await user.save();

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};
