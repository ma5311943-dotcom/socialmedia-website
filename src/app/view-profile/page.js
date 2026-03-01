'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Calendar, Shield, MapPin,
    Link as LinkIcon, Edit3, Grid, Bookmark,
    Settings, MessageSquare, Heart, Users,
    Camera, Loader2, ArrowLeft, X, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { Suspense } from 'react';

function ViewProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('posts');
    const [showFollowModal, setShowFollowModal] = useState(false);
    const [followModalType, setFollowModalType] = useState('followers');
    const [followLists, setFollowLists] = useState({ followers: [], following: [] });
    const [isLoadingFollows, setIsLoadingFollows] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const userInfoStr = localStorage.getItem('userInfo');
            const loggedInUser = userInfoStr ? JSON.parse(userInfoStr) : null;
            setCurrentUser(loggedInUser);
            let userId = searchParams.get('id');
            if (!userId && loggedInUser) {
                userId = loggedInUser._id;
            }


            if (!userId) {
                router.push('/Login');
                return;
            }

            try {
                const res = await fetch(`/api/users/${userId}`);
                const data = await res.json();

                if (res.ok) {
                    setUser(data);
                } else {
                    setError(data.message || 'Failed to load profile');
                }
            } catch (err) {
                setError('Network error. Please refresh.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [searchParams, router]);

    const handleOpenFollowModal = async (type) => {
        setFollowModalType(type);
        setShowFollowModal(true);
        setIsLoadingFollows(true);
        try {
            const res = await fetch(`/api/users/${user._id}/follow-lists`);
            const data = await res.json();
            if (res.ok) {
                setFollowLists(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingFollows(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white px-4">
                <div className="p-8 dark-glass rounded-3xl border border-red-500/20 text-center">
                    <p className="text-red-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-zinc-900 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-medium uppercase tracking-widest"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa] selection:bg-emerald-500/30">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-10">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    {/* Cover Photo */}
                    <div className="h-64 md:h-80 w-full bg-zinc-900 rounded-[3rem] overflow-hidden relative border border-white/5 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#09090b]/80" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-[#ff5c3310]" />
                        <button className="absolute bottom-6 right-6 p-3 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all group">
                            <Camera size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    {/* Avatar & Info Container */}
                    <div className="px-8 md:px-16 -mt-20 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                                {/* Avatar */}
                                <div className="w-40 h-40 bg-[#09090b] rounded-[2.5rem] p-1 shadow-2xl border border-white/10 relative group">
                                    <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-[2.3rem] flex items-center justify-center text-5xl font-semibold text-white italic shadow-inner">
                                        {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-[2.3rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-[#09090b] flex items-center justify-center shadow-lg">
                                        <Shield size={16} className="text-white" />
                                    </div>
                                </div>

                                {/* User Meta */}
                                <div className="pb-4 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-4xl font-semibold text-white tracking-tighter uppercase italic">{user.username}</h1>
                                        {user.role === 'admin' && (
                                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded-full uppercase tracking-tighter">Admin</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-zinc-500">
                                        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                                            <Mail size={14} className="text-zinc-600" /> {user.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                                            <Calendar size={14} className="text-zinc-600" /> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pb-4">
                                {searchParams.get('id') && currentUser && searchParams.get('id') !== currentUser._id ? (
                                    <Link
                                        href={`/messages?userId=${user._id}`}
                                        className="flex-1 md:flex-none px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-[12px] uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare size={16} /> Send Message
                                    </Link>
                                ) : (
                                    <Link
                                        href="/profile/edit"
                                        className="flex-1 md:flex-none px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-[12px] uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/10 text-center"
                                    >
                                        Edit Profile
                                    </Link>
                                )}



                                <Link
                                    href="/settings"
                                    className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all block"
                                >
                                    <Settings size={20} />
                                </Link>

                            </div>

                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 px-2">
                    {[
                        { id: 'followers', label: 'Followers', val: user.stats?.followers || 0, color: 'text-emerald-400', icon: Users },
                        { id: 'following', label: 'Following', val: user.stats?.following || 0, color: 'text-orange-400', icon: User },
                        { id: 'posts', label: 'Total Posts', val: user.stats?.totalPosts || 0, color: 'text-yellow-400', icon: Zap },
                        { id: 'interactions', label: 'Interactions', val: user.stats?.totalInteractions || 0, color: 'text-blue-400', icon: Heart }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * i }}
                            onClick={() => (stat.id === 'followers' || stat.id === 'following') && handleOpenFollowModal(stat.id)}
                            className={`p-6 dark-glass rounded-[2rem] border border-white/5 text-center group cursor-pointer hover:border-white/10 transition-all ${stat.id === 'followers' || stat.id === 'following' ? 'hover:scale-[1.05]' : ''}`}
                        >
                            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className={`text-3xl font-semibold ${stat.color} tracking-tighter italic`}>{stat.val}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Content Tabs */}
                <div className="mt-12 space-y-8">
                    <div className="flex items-center gap-2 border-b border-white/5 px-2">
                        {[
                            { id: 'posts', label: 'My Posts', icon: Grid },
                            { id: 'saved', label: 'Saved', icon: Bookmark },
                            { id: 'about', label: 'About Me', icon: User }

                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                                    }`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Placeholder */}
                    <div className="min-h-[400px]">
                        {activeTab === 'posts' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {user?.posts?.length > 0 ? (
                                    user.posts.map((post) => (
                                        <div key={post._id} className="relative aspect-square bg-zinc-900 rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-emerald-500/50 transition-all cursor-pointer">
                                            {post.image ? (
                                                <img src={post.image} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center p-6 text-center text-zinc-400 bg-zinc-900/80 font-medium text-[12px]">
                                                    {post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content}
                                                </div>
                                            )}
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                                                <div className="flex items-center gap-2 text-white font-semibold">
                                                    <Heart size={20} fill={post.likes?.length > 0 ? "currentColor" : "none"} className={post.likes?.length > 0 ? "text-emerald-400" : ""} /> {post.likes?.length || 0}
                                                </div>
                                                <div className="flex items-center gap-2 text-white font-semibold">
                                                    <MessageSquare size={20} /> {post.comments?.length || 0}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-1 md:col-span-3 aspect-video bg-zinc-900/50 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center p-8 text-zinc-700">
                                        <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center mb-4">
                                            <Grid size={24} />
                                        </div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">No Posts Shared Yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="p-8 dark-glass rounded-[3rem] border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-xl font-semibold text-white uppercase tracking-tighter mb-4">About Me</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl font-medium">
                                    {user.bio ? user.bio : "No bio available yet. Personalize your presence in the Connecto community by updating your profile settings. Share your interests with the world."}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            <Footer />

            {/* Follow Lists Modal */}
            <AnimatePresence>
                {showFollowModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center px-4 backdrop-blur-3xl bg-black/60"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-[3.5rem] p-10 shadow-3xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16" />

                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div>
                                    <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">{followModalType}</h2>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.4em]">Connection Stream</p>
                                </div>
                                <button
                                    onClick={() => setShowFollowModal(false)}
                                    className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                                {isLoadingFollows ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Scanning Network...</p>
                                    </div>
                                ) : (followLists[followModalType] || []).length > 0 ? (
                                    (followLists[followModalType] || []).map((u) => (
                                        <Link
                                            key={u._id}
                                            href={`/view-profile?id=${u._id}`}
                                            onClick={() => setShowFollowModal(false)}
                                            className="flex items-center gap-5 p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all group"
                                        >
                                            <div className="w-14 h-14 bg-zinc-800 rounded-2xl border border-white/5 flex items-center justify-center text-xl font-bold text-emerald-500 italic shadow-2xl group-hover:rotate-6 transition-transform">
                                                {u.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[15px] font-bold text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">{u.username}</p>
                                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{u.role === 'admin' ? 'Admin' : 'Community Member'}</p>
                                            </div>
                                            <ArrowLeft className="rotate-180 text-zinc-700 group-hover:text-emerald-500 transition-colors" size={18} />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-20 space-y-6 opacity-40 grayscale">
                                        <Users className="mx-auto text-zinc-700" size={40} />
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">No connection records found in the current stream.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Decorative Particles */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>}>
            <ViewProfileContent />
        </Suspense>
    );
}
