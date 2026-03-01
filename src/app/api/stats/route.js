import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';

export async function GET() {
    try {
        await dbConnect();
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();

        // Extract hashtags from posts
        const posts = await Post.find({}, 'content');
        const tagMap = {};
        const hashtagRegex = /#[\w\u0080-\uffff]+/g;

        posts.forEach(post => {
            if (post.content) {
                const matches = post.content.match(hashtagRegex);
                if (matches) {
                    matches.forEach(tag => {
                        const normalized = tag.toLowerCase();
                        tagMap[normalized] = (tagMap[normalized] || 0) + 1;
                    });
                }
            }
        });

        // Default tags if none found
        const defaultTags = ['#connecto', '#social', '#tech', '#ai', '#future'];
        const extractedTags = Object.keys(tagMap)
            .sort((a, b) => tagMap[b] - tagMap[a])
            .slice(0, 10);

        const tags = extractedTags.length > 0 ? extractedTags : defaultTags;

        return NextResponse.json({
            users: userCount,
            posts: postCount,
            tags: tags
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
