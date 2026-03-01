'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Hash, TrendingUp, User, ArrowLeft, Loader2, Rocket } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ users: [], posts: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [trendingTags] = useState(['#midnight', '#lifestyle', '#connecto']);


    useEffect(() => {
        fetchSuggestedUsers();
    }, []);

    const fetchSuggestedUsers = async () => {
        try {
            const res = await fetch('/api/users?limit=3');
            const data = await res.json();
            if (res.ok) setSuggestedUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (res.ok) {
                setResults(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };


    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <div className="space-y-12">
                    {/* Search Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-semibold text-white uppercase tracking-tighter italic">Search</h1>
                        <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-[0.5em]">Explore the community</p>
                    </div>


                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for people, posts, or tags..."

                            className="w-full bg-zinc-900 border border-white/5 rounded-[2.5rem] py-8 pl-10 pr-32 text-white font-medium text-lg placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/30 transition-all shadow-2xl"
                        />
                        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                            <Search size={24} />
                        </div>
                        <button
                            type="submit"
                            className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold uppercase text-[12px] tracking-widest rounded-2xl transition-all active:scale-95"
                        >
                            Search
                        </button>

                    </form>

                    {/* Trends & Suggestions */}
                    {!query && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            <div className="p-8 dark-glass border border-white/5 rounded-[2.5rem]">
                                <h3 className="text-[12px] font-semibold text-zinc-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <TrendingUp size={16} /> Popular Trends
                                </h3>

                                <div className="space-y-6">
                                    {trendingTags.map((tag, i) => (
                                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                                            <p className="font-medium text-white group-hover:text-emerald-400 transition-colors uppercase tracking-widest italic">{tag}</p>
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest italic">Trending</p>
                                        </div>
                                    ))}
                                </div>

                            </div>

                            <div className="p-8 dark-glass border border-white/5 rounded-[2.5rem]">
                                <h3 className="text-[12px] font-semibold text-zinc-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Users size={16} /> Suggested Profiles
                                </h3>
                                <div className="space-y-6">
                                    {suggestedUsers.length > 0 ? suggestedUsers.map((user) => (
                                        <Link href={`/view-profile?id=${user._id}`} key={user._id} className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-10 h-10 bg-zinc-900 rounded-xl border border-white/5 flex items-center justify-center text-emerald-500 font-semibold italic">
                                                {user.username.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">{user.username}</p>
                                                <p className="text-[9px] font-medium text-zinc-600 uppercase">Suggested Member</p>
                                            </div>
                                        </Link>
                                    )) : (
                                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">No members found</p>
                                    )}

                                </div>

                            </div>
                        </motion.div>
                    )}

                    {/* Results Area */}
                    {isSearching && (
                        <div className="flex flex-col items-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                            <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.3em]">Searching...</p>
                        </div>

                    )}

                    {!isSearching && query && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                            {results.users.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-[12px] font-bold text-zinc-600 uppercase tracking-widest pl-4">People</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {results.users.map(u => (
                                            <Link href={`/view-profile?id=${u._id}`} key={u._id} className="p-6 dark-glass border border-white/5 rounded-3xl flex items-center gap-4 group hover:border-emerald-500/20 transition-all">
                                                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black font-bold italic shadow-lg shadow-emerald-500/10">
                                                    {u.username.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[14px] font-bold text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">{u.username}</p>
                                                    <p className="text-[10px] font-medium text-zinc-600 uppercase">Member</p>
                                                </div>

                                                <ArrowLeft className="w-4 h-4 text-zinc-700 rotate-180 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.posts.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-[12px] font-bold text-zinc-600 uppercase tracking-widest pl-4">Posts</h3>

                                    <div className="space-y-4">
                                        {results.posts.map(p => (
                                            <div key={p._id} className="p-8 dark-glass border border-white/5 rounded-[2.5rem] group hover:border-white/10 transition-all">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-emerald-500 italic border border-white/5">
                                                        {p.user.username.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{p.user.username} shared</span>
                                                </div>

                                                <p className="text-[15px] text-zinc-300 leading-relaxed font-medium line-clamp-3">{p.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.users.length === 0 && results.posts.length === 0 && (
                                <div className="text-center py-32 space-y-6 bg-zinc-900/30 border border-white/5 rounded-[3rem]">
                                    <Rocket size={40} className="mx-auto text-zinc-700" />
                                    <p className="text-zinc-500 font-medium uppercase tracking-widest text-[13px]">No matching results found.</p>
                                    <button onClick={() => setQuery('')} className="text-emerald-500 text-[11px] font-semibold uppercase tracking-widest hover:underline">Clear Search</button>
                                </div>

                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
