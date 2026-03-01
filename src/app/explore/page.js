'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, Share2, MoreHorizontal,
    PlusSquare, Image as ImageIcon, Send, Loader2,
    TrendingUp, Users, Bookmark, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/useToast';

export default function ExplorePage() {
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [newComment, setNewComment] = useState({});
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const { showToast } = useToast();


    const [stats, setStats] = useState({ users: 0, posts: 0, tags: [] });

    useEffect(() => {
        const fetchUserData = async () => {
            const userStr = localStorage.getItem('userInfo');
            if (userStr) {
                const parsed = JSON.parse(userStr);
                const res = await fetch(`/api/users/${parsed._id}`);
                const fullData = await res.json();
                if (res.ok) setCurrentUser(fullData);
            }
        };

        fetchUserData();
        fetchPosts();
        fetchSuggestedUsers();
        fetchStories();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            if (res.ok) setStats(data);
        } catch (err) {
            console.error(err);
        }
    };



    const fetchStories = async () => {
        try {
            const res = await fetch('/api/stories');
            const data = await res.json();
            if (res.ok) setStories(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSuggestedUsers = async () => {
        try {
            const res = await fetch('/api/users?limit=3');
            const data = await res.json();
            if (res.ok) setSuggestedUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            if (res.ok) setPosts(data);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFollow = async (targetId) => {
        if (!currentUser) return;

        // Optimistic update
        const isFollowing = currentUser.following?.includes(targetId);
        const newFollowing = isFollowing
            ? currentUser.following.filter(id => id !== targetId)
            : [...(currentUser.following || []), targetId];

        setCurrentUser({ ...currentUser, following: newFollowing });

        try {
            const res = await fetch('/api/users/follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id, targetId })
            });
            if (res.ok) {
                const data = await res.json();
                showToast(data.isFollowing ? 'Following!' : 'Unfollowed!', 'success');
                // fetchSuggestedUsers(); // No need to fetch if we have local state
            }
        } catch (err) {
            console.error(err);
            // Revert if error
            setCurrentUser(currentUser);
        }
    };



    const handleLike = async (postId) => {
        if (!currentUser) return;
        try {
            const res = await fetch('/api/posts/like', {
                method: 'POST',
                body: JSON.stringify({ postId, userId: currentUser._id })
            });
            if (res.ok) {
                const updatedPost = await res.json();
                setPosts(posts.map(p => p._id === postId ? { ...p, likes: updatedPost.likes } : p));
                showToast('Post liked!', 'success');
            }
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handleToggleSave = async (postId) => {
        if (!currentUser) return;

        // Optimistic update
        const isSaved = currentUser.savedPosts?.includes(postId);
        const newSaved = isSaved
            ? currentUser.savedPosts.filter(id => id !== postId)
            : [...(currentUser.savedPosts || []), postId];

        setCurrentUser({ ...currentUser, savedPosts: newSaved });

        try {
            const res = await fetch('/api/posts/toggle-save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id, postId })
            });
            if (res.ok) {
                const data = await res.json();
                showToast(data.isSaved ? 'Post saved to Archives!' : 'Post removed from Archives.', 'success');
            }
        } catch (err) {
            console.error(err);
            setCurrentUser(currentUser); // Restore on error
        }
    };


    const handleComment = async (postId) => {
        if (!currentUser || !newComment[postId]) return;
        try {
            const res = await fetch('/api/posts/comment', {
                method: 'POST',
                body: JSON.stringify({
                    postId,
                    userId: currentUser._id,
                    text: newComment[postId]
                })
            });
            if (res.ok) {
                const updatedPost = await res.json();
                setPosts(posts.map(p => p._id === postId ? updatedPost : p));
                setNewComment({ ...newComment, [postId]: '' });
                showToast('Comment added!', 'success');
            }

        } catch (err) {
            console.error('Comment error:', err);
        }
    };

    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa] selection:bg-emerald-500/30">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Sidebar - Navigation & Trends */}
                <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
                    <div className="p-6 dark-glass rounded-3xl border border-white/5 space-y-6">
                        <h2 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.3em]">Quick Hub</h2>
                        <nav className="space-y-2">
                            <Link href="/explore" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-emerald-400 rounded-2xl text-[12px] font-medium uppercase tracking-widest">
                                <TrendingUp size={18} /> Global Feed
                            </Link>
                            <Link href="/suggested" className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-white hover:bg-white/5 transition-all rounded-2xl text-[12px] font-medium uppercase tracking-widest">
                                <Users size={18} /> Find Friends
                            </Link>
                            <Link href="/saved" className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-white hover:bg-white/5 transition-all rounded-2xl text-[12px] font-medium uppercase tracking-widest">
                                <Bookmark size={18} /> Archived
                            </Link>
                        </nav>
                    </div>

                    <div className="p-6 dark-glass rounded-3xl border border-white/5 space-y-6">
                        <h2 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.3em]">Trending Now</h2>
                        <div className="space-y-4">
                            <div className="group cursor-pointer">
                                <p className="text-[12px] font-semibold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-widest italic">{stats.users} Members</p>
                                <p className="text-[10px] font-medium text-zinc-600 uppercase">Live Community</p>
                            </div>
                            <div className="group cursor-pointer">
                                <p className="text-[12px] font-semibold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-widest italic">{stats.posts} Posts</p>
                                <p className="text-[10px] font-medium text-zinc-600 uppercase">Shared Moments</p>
                            </div>
                            {(stats.tags || []).map((tag) => (
                                <div key={tag} className="group cursor-pointer pt-2">
                                    <p className="text-[11px] font-bold text-zinc-400 group-hover:text-emerald-400 transition-colors uppercase tracking-widest">{tag}</p>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Main Feed */}
                <div className="col-span-1 lg:col-span-6 space-y-8">
                    {/* Stories Tray */}
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        <Link href="/create-story" className="flex-shrink-0 flex flex-col items-center gap-2 group">
                            <div className="w-20 h-20 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center text-zinc-600 group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-all bg-zinc-900/50">
                                <PlusSquare size={24} />
                            </div>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Your Story</span>
                        </Link>

                        {stories.map((story) => (
                            <div key={story._id} className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-20 h-20 rounded-[2rem] border-2 border-emerald-500 p-1 group-hover:scale-105 transition-transform">
                                    <div className="w-full h-full rounded-[1.6rem] bg-zinc-800 overflow-hidden relative">
                                        <img src={story.media} className="w-full h-full object-cover" alt="Story" />
                                        <div className="absolute inset-0 bg-black/20" />
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-white uppercase tracking-tighter truncate w-20 text-center">{story.user.username}</span>
                            </div>
                        ))}
                    </div>

                    {/* Create Post Shortcut */}
                    <Link href="/create-post" className="block p-6 dark-glass rounded-[2rem] border border-white/10 group hover:border-emerald-500/30 transition-all shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-emerald-400">
                                <PlusSquare size={24} />
                            </div>
                            <p className="text-zinc-500 font-medium uppercase tracking-widest text-[13px] group-hover:text-white transition-colors">What's on your mind?</p>
                        </div>
                    </Link>



                    {/* Feed Content */}
                    <div className="space-y-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center py-20 gap-4">
                                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Loading Feed...</p>
                            </div>

                        ) : posts.length > 0 ? (
                            posts.map((post, idx) => (
                                <motion.article
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="dark-glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
                                >
                                    {/* Post Header */}
                                    <div className="p-6 flex items-center justify-between">
                                        <Link href={`/view-profile?id=${post.user._id}`} className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-semibold italic text-lg shadow-lg group-hover:scale-105 transition-transform">
                                                {post.user.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-[13px] font-semibold text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">{post.user.username}</h3>
                                                <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">Recently Shared</p>
                                            </div>
                                        </Link>

                                        <button className="text-zinc-600 hover:text-white"><MoreHorizontal size={20} /></button>
                                    </div>

                                    {/* Post Image */}
                                    {post.image && (
                                        <div className="relative aspect-[4/5] bg-zinc-900 group cursor-pointer overflow-hidden border-y border-white/5">
                                            <img
                                                src={post.image}
                                                alt="Post"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}


                                    {/* Post Content */}
                                    <div className="p-8 space-y-6">
                                        <p className="text-[15px] text-zinc-300 leading-relaxed font-medium">
                                            {post.content}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-6 pt-2">
                                            <button
                                                onClick={() => handleLike(post._id)}
                                                className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest transition-all hover:scale-110 ${post.likes.includes(currentUser?._id) ? 'text-emerald-400' : 'text-zinc-500'
                                                    }`}
                                            >
                                                <Heart size={20} fill={post.likes.includes(currentUser?._id) ? 'currentColor' : 'none'} /> {post.likes.length} Likes
                                            </button>
                                            <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[11px] font-semibold uppercase tracking-widest">
                                                <MessageCircle size={20} /> {post.comments.length} Comments
                                            </button>
                                            <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[11px] font-semibold uppercase tracking-widest">
                                                <Share2 size={20} /> Share
                                            </button>
                                            <button
                                                onClick={() => handleToggleSave(post._id)}
                                                className={`flex items-center gap-2 transition-all text-[11px] font-semibold uppercase tracking-widest ${currentUser?.savedPosts?.includes(post._id) ? 'text-blue-400' : 'text-zinc-500 hover:text-white'
                                                    }`}
                                            >
                                                <Bookmark size={20} fill={currentUser?.savedPosts?.includes(post._id) ? 'currentColor' : 'none'} /> {currentUser?.savedPosts?.includes(post._id) ? 'Saved' : 'Archive'}
                                            </button>
                                        </div>


                                        {/* Comments Preview */}
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            {post.comments.slice(-2).map((comment, i) => (
                                                <div key={i} className="flex gap-3 text-[12px]">
                                                    <span className="font-semibold text-emerald-400 uppercase tracking-tighter">{comment.user.username}:</span>
                                                    <span className="text-zinc-400 font-medium leading-tight">{comment.text}</span>
                                                </div>
                                            ))}

                                            {/* Comment Input */}
                                            {currentUser && (
                                                <div className="flex items-center gap-3 pt-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Add a comment..."
                                                        value={newComment[post._id] || ''}
                                                        onChange={(e) => setNewComment({ ...newComment, [post._id]: e.target.value })}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                                        className="flex-1 bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-[12px] font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/30 transition-all uppercase tracking-widest"
                                                    />
                                                    <button
                                                        onClick={() => handleComment(post._id)}
                                                        className="text-emerald-500 hover:text-emerald-400 active:scale-95 transition-all"
                                                    >
                                                        <Send size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            ))
                        ) : (
                            <div className="text-center py-20 px-8 dark-glass rounded-[3rem] border border-white/5">
                                <Sparkles size={40} className="mx-auto text-emerald-500 mb-6 animate-slow-spin" />
                                <h3 className="text-2xl font-semibold text-white uppercase tracking-tighter mb-2">Feed is Empty</h3>
                                <p className="text-zinc-500 text-[13px] font-medium uppercase tracking-widest">Be the first to share something with the community.</p>
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Sidebar - Suggestions */}
                <div className="hidden xl:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
                    <div className="p-8 dark-glass rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                        <h2 className="text-[11px] font-semibold text-white uppercase tracking-[0.4em] mb-8 italic">New members</h2>
                        <div className="space-y-6">
                            {suggestedUsers.length > 0 ? suggestedUsers.map((user, i) => (
                                <Link href={`/view-profile?id=${user._id}`} key={user._id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-900 rounded-xl border border-white/5 flex items-center justify-center text-[10px] font-semibold text-emerald-500">
                                            {user.username.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-semibold text-white uppercase tracking-tighter">{user.username}</p>
                                            <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest">{user.role === 'admin' ? 'Admin' : 'Community Member'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFollow(user._id);
                                        }}
                                        className={`text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 border rounded-lg transition-all active:scale-95 ${currentUser?.following?.includes(user._id)
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            : 'text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                                            }`}
                                    >
                                        {currentUser?.following?.includes(user._id) ? 'Following' : 'Follow'}
                                    </button>


                                </Link>
                            )) : (
                                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">No members found</p>
                            )}
                        </div>

                    </div>

                    <div className="p-6 text-center">
                        <p className="text-[10px] font-medium text-zinc-700 uppercase tracking-widest">Connecto Social • 2024</p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
