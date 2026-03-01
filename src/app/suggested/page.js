'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, UserPlus, Search,
    Sparkles, Shield, Loader2,
    ArrowRight, Activity, Zap
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/useToast';
import Link from 'next/link';

export default function SuggestedPage() {
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const { showToast } = useToast();

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
        fetchAgents();
    }, []);


    const fetchAgents = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (res.ok) setAgents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFollow = async (targetId) => {
        if (!currentUser) {
            showToast('Please login to follow.', 'error');
            return;
        }

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
            }
        } catch (err) {
            console.error(err);
            setCurrentUser(currentUser);
        }
    };





    const filteredAgents = agents.filter(a =>
        a.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-16">
                <header className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                            <Users size={14} className="animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Networking</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter uppercase italic">Find <br /><span className="text-emerald-500">Friends</span></h1>
                    </div>

                    <div className="w-full md:w-96 relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Find someone by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-[12px] font-bold uppercase tracking-widest focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-700"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <div className="col-span-full py-32 flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Loading people...</p>
                        </div>

                    ) : filteredAgents.length > 0 ? (
                        filteredAgents.map((agent, idx) => (
                            <motion.div
                                key={agent._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group p-8 dark-glass rounded-[3rem] border border-white/5 hover:border-emerald-500/20 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />

                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="w-16 h-16 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-[1.5rem] border border-white/5 flex items-center justify-center text-2xl font-bold text-emerald-500 italic shadow-2xl group-hover:scale-110 transition-transform">
                                            {agent.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{agent.role === 'admin' ? 'Admin' : 'Active Member'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">{agent.username}</h3>
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-1">{agent.role === 'admin' ? 'Admin' : 'Community Member'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                <span className="text-[10px] font-bold text-white uppercase italic">Online</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Popularity</p>
                                            <div className="flex items-center gap-2">
                                                <Activity size={12} className="text-emerald-500" />
                                                <span className="text-[10px] font-bold text-white uppercase italic">High</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pt-4">
                                        <button
                                            onClick={() => handleFollow(agent._id)}
                                            className={`flex-1 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${currentUser?.following?.includes(agent._id)
                                                ? 'bg-zinc-800 text-zinc-400'
                                                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/10'
                                                }`}
                                        >
                                            {currentUser?.following?.includes(agent._id) ? 'Following' : 'Follow User'} <Zap size={14} />
                                        </button>



                                        <Link
                                            href={`/view-profile?id=${agent._id}`}
                                            className="p-4 bg-zinc-900 text-zinc-500 hover:text-white rounded-2xl border border-white/5 transition-colors"
                                        >
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 dark-glass rounded-[3rem] border border-white/5">
                            <Sparkles size={40} className="mx-auto text-emerald-500 mb-6" />
                            <h3 className="text-2xl font-semibold text-white uppercase tracking-tighter mb-2">No results</h3>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">No members matching your search were found.</p>
                        </div>

                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
