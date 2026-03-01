'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, Flame, MessageSquare, Heart,
    Share2, Sparkles, Loader2, Award, Clock,
    Zap
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TrendingPage() {
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTag, setActiveTag] = useState('#all');
    const [stats, setStats] = useState({ userCount: 0, postCount: 0, networkSpeed: '99.9%', serverLoad: 'Normal' });


    const tags = ['#all', '#social', '#viral', '#trending', '#global'];


    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // In a real app, this would be /api/posts/trending
                const res = await fetch('/api/posts');
                const data = await res.json();
                if (res.ok) {
                    // Mock sorting by popularity (likes + comments)
                    const sorted = [...data].sort((a, b) =>
                        (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length)
                    );
                    setTrendingPosts(sorted.slice(0, 5));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTrending();
        fetchStats();
    }, []);


    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-16">
                <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                            <TrendingUp size={14} className="animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Trending Now</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter uppercase italic">Viral <br /><span className="text-emerald-500">Stories</span></h1>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTag === tag
                                    ? 'bg-white text-black shadow-xl -translate-y-1'
                                    : 'bg-white/5 text-zinc-500 hover:text-white border border-white/5'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Top Chart Section */}
                    <div className="lg:col-span-8 space-y-8">
                        {isLoading ? (
                            <div className="py-32 flex flex-col items-center gap-4">
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Finding viral posts...</p>
                            </div>

                        ) : trendingPosts.length > 0 ? (
                            trendingPosts.map((post, idx) => (
                                <motion.div
                                    key={post._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-4xl font-bold text-zinc-900 italic tracking-tighter opacity-50 group-hover:text-emerald-500/20 transition-colors pointer-events-none">
                                        0{idx + 1}
                                    </div>
                                    <div className="dark-glass rounded-[2rem] border border-white/5 overflow-hidden group-hover:border-white/10 transition-all">
                                        <div className="flex flex-col md:flex-row">
                                            {post.image && (
                                                <div className="w-full md:w-48 h-48 md:h-auto bg-zinc-900 shrink-0">
                                                    <img src={post.image} className="w-full h-full object-cover" alt="Trending" />
                                                </div>
                                            )}
                                            <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-black italic">
                                                            {post.user.username.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{post.user.username} shared</span>
                                                    </div>

                                                    <p className="text-[16px] text-zinc-200 font-medium leading-relaxed">{post.content}</p>
                                                </div>
                                                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                                        <Heart size={14} fill="currentColor" /> {post.likes.length} Intensity
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                        <MessageSquare size={14} /> {post.comments.length} Echoes
                                                    </div>
                                                    <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                                        <div className="flex items-center gap-2 text-emerald-500">
                                                            <Zap
                                                                size={14} />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">Hot 🔥</span>
                                                        </div>
                                                        <Link href="/explore" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
                                                            View Full Post
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20 dark-glass rounded-[3rem] border border-white/5">
                                <Sparkles size={40} className="mx-auto text-emerald-500 mb-6" />
                                <h3 className="text-2xl font-semibold text-white uppercase tracking-tighter mb-2">Finding Trends</h3>
                                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">Insufficient data to map viral content.</p>
                            </div>

                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="p-8 dark-glass rounded-[2.5rem] border border-white/10 space-y-8">
                            <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.4em] flex items-center gap-3 italic">
                                <TrendingUp size={16} className="text-emerald-500" /> System Velocity
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Zap size={14} className="text-emerald-500" />
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Network Speed</span>
                                    </div>

                                    <span className="text-[12px] font-bold text-white uppercase italic">{stats.networkSpeed}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp size={14} className="text-emerald-500" />
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Posts</span>
                                    </div>
                                    <span className="text-[12px] font-bold text-white uppercase italic">{stats.postCount}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Sparkles size={14} className="text-emerald-500" />
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Member Count</span>
                                    </div>

                                    <span className="text-[12px] font-bold text-white uppercase italic">{stats.userCount}</span>
                                </div>

                            </div>
                        </div>

                        <div className="p-10 bg-emerald-500 rounded-[3rem] text-black space-y-6 relative overflow-hidden group">
                            <Sparkles className="absolute -top-4 -right-4 w-24 h-24 opacity-20 rotate-12 group-hover:scale-110 transition-transform" />
                            <h3 className="text-3xl font-bold uppercase leading-none tracking-tighter italic">Join the <br />Community</h3>
                            <p className="text-[12px] font-bold uppercase tracking-wider leading-relaxed">Early users get special profile badges.</p>

                            <Link href="/create-post" className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-2xl hover:translate-x-1 transition-transform">
                                Share Post <Share2 size={14} />
                            </Link>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
