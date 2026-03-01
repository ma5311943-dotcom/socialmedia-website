'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bookmark, PlusSquare, Image as ImageIcon,
    Loader2, Hash, Zap, Sparkles, Filter
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SavedPage() {
    const [savedPosts, setSavedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleRemove = async (postId) => {
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!user?._id) return;

        // Optimistic update
        setSavedPosts(prev => prev.filter(p => p._id !== postId));

        try {
            await fetch('/api/posts/toggle-save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, postId })
            });
        } catch (err) {
            console.error('Failed to remove bookmark:', err);
            // Refresh on error
            window.location.reload();
        }
    };

    useEffect(() => {

        const fetchSaved = async () => {
            const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (!user?._id) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/posts/saved?userId=${user._id}`);
                const data = await res.json();
                if (res.ok) {
                    setSavedPosts(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSaved();
    }, []);


    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-16">
                <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                            <Bookmark size={14} fill="currentColor" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Library</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter uppercase italic">Saved <br /><span className="text-emerald-500">Posts</span></h1>

                    </div>

                    <button className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all">
                        <Filter size={14} /> Filter
                    </button>

                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <div className="col-span-full py-32 flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Loading bookmarks...</p>
                        </div>

                    ) : savedPosts.length > 0 ? (
                        savedPosts.map((post, idx) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/20 shadow-2xl transition-all"
                            >
                                <div className="absolute top-6 right-6 z-10">
                                    <div className="p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                                        <Bookmark size={18} fill="currentColor" />
                                    </div>
                                </div>

                                {post.image ? (
                                    <div className="relative aspect-square">
                                        <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Archive" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-zinc-900 flex items-center justify-center p-12 text-center">
                                        <p className="text-[14px] text-zinc-500 font-medium italic">"{post.content.substring(0, 100)}..."</p>
                                    </div>
                                )}

                                <div className="p-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.3em]">From: @{post.user.username}</span>
                                    </div>

                                    <h3 className="text-[14px] font-bold text-white uppercase tracking-widest line-clamp-2 leading-relaxed">
                                        {post.content}
                                    </h3>
                                    <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                        <Link href="/explore" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                                            View Original <Zap size={12} />
                                        </Link>
                                        <button
                                            onClick={() => handleRemove(post._id)}
                                            className="ml-auto text-red-500/50 hover:text-red-500 transition-colors uppercase text-[9px] font-bold tracking-widest"
                                        >
                                            Remove Item
                                        </button>

                                    </div>

                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-40 text-center dark-glass rounded-[4rem] border border-white/5 space-y-8">
                            <Sparkles size={48} className="mx-auto text-zinc-700 animate-slow-spin" />
                            <div className="space-y-4">
                                <h3 className="text-3xl font-semibold text-white uppercase tracking-tighter italic">Library Empty</h3>
                                <p className="text-zinc-600 text-[11px] font-bold uppercase tracking-[0.2em] max-w-sm mx-auto">Explore your news feed and bookmark your favorite posts.</p>
                            </div>
                            <Link href="/explore" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                                Go to Feed <Zap size={14} />
                            </Link>
                        </div>

                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
