'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Heart, MessageCircle, AlertTriangle,
    Zap, Loader2, Sparkles, Filter, MoreHorizontal, UserPlus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function NotificationsPage({ initialFilter = 'all' }) {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(initialFilter);

    const tabs = [
        { id: 'all', label: 'All', icon: Bell },
        { id: 'likes', label: 'Likes', icon: Heart },
        { id: 'comments', label: 'Comments', icon: MessageCircle },
        { id: 'follows', label: 'Follows', icon: UserPlus },
        { id: 'alerts', label: 'Alerts', icon: AlertTriangle }
    ];


    const fetchNotifications = async () => {
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!user?._id) {
            setIsLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/notifications?userId=${user._id}`);
            const data = await res.json();
            if (res.ok) setNotifications(data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await fetch(`/api/notifications?id=${id}`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const handleClearAll = async () => {
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!user?._id) return;
        try {
            await fetch(`/api/notifications?userId=${user._id}`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };



    const filtered = activeTab === 'all' ? notifications : notifications.filter(n => n.type === activeTab);

    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                            <Zap size={14} className="animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Updates</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter uppercase italic">Recent <br /><span className="text-emerald-500">Activity</span></h1>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-emerald-500 text-black shadow-xl'
                                        : 'text-zinc-500 hover:text-white'
                                        }`}
                                >
                                    <tab.icon size={14} /> {tab.label}
                                </button>
                            ))}
                        </div>
                        {notifications.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-[10px] font-bold text-zinc-600 hover:text-[#ff5c33] uppercase tracking-[0.3em] transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                </header>


                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-32 flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Checking notifications...</p>
                        </div>

                    ) : filtered.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {filtered.map((note, i) => (
                                <motion.div
                                    key={note.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`group p-6 dark-glass rounded-[2rem] border transition-all flex items-center gap-6 relative overflow-hidden ${note.read ? 'border-white/5 opacity-70' : 'border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]'}`}
                                >
                                    {!note.read && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
                                    <div className={`p-5 rounded-2xl bg-zinc-900 border border-white/5 ${note.color} group-hover:scale-110 transition-transform shadow-inner`}>
                                        {(() => {
                                            const Icon = tabs.find(t => t.id === note.type)?.icon || Bell;
                                            return <Icon size={24} />;
                                        })()}
                                    </div>


                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[11px] font-bold text-zinc-700 uppercase tracking-widest">{note.type}</p>
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{note.time}</span>
                                        </div>
                                        <p className="text-[16px] font-medium text-white leading-tight">
                                            <Link href={`/view-profile?username=${note.from}`} className="font-bold text-emerald-500 uppercase italic tracking-tighter mr-2 hover:underline">{note.from}</Link>
                                            {note.msg}
                                        </p>
                                    </div>


                                    <div className="flex items-center gap-2">
                                        {!note.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(note.id)}
                                                className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
                                                title="Mark as read"
                                            >
                                                <Zap size={14} />
                                            </button>
                                        )}
                                        <button className="p-3 text-zinc-700 hover:text-white transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="py-40 text-center dark-glass rounded-[4rem] border border-white/5 space-y-6">
                            <Sparkles size={48} className="mx-auto text-zinc-700" />
                            <div className="space-y-2">
                                <h3 className="text-3xl font-semibold text-white uppercase tracking-tighter italic">No Notifications</h3>
                                <p className="text-zinc-600 text-[11px] font-bold uppercase tracking-[0.2em]">You're all caught up! Check back later.</p>
                            </div>
                        </div>

                    )}
                </div>

                <div className="mt-16 p-10 border border-white/5 bg-[#ff5c3305] rounded-[3.5rem] flex flex-col md:flex-row items-center gap-8 group">
                    <div className="p-8 rounded-[2.5rem] bg-[#ff5c33] text-white shadow-2xl shadow-[#ff5c3320] group-hover:rotate-12 transition-transform">
                        <AlertTriangle size={40} />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-3">
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tighter italic leading-none">Stay Updated</h3>
                        <p className="text-[12px] font-medium text-zinc-500 uppercase tracking-widest leading-relaxed">Turn on push notifications in settings to never miss a message or interaction from your followers.</p>
                    </div>
                </div>

            </main>
            <Footer />
        </div >
    );
}
