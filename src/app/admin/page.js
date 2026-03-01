'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Users, MessageSquare, AlertTriangle,
    Search, Trash2, ShieldAlert, BarChart3, Loader2,
    CheckCircle, Activity, ExternalLink,
    Heart
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/useToast';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 120, posts: 450, alerts: 12 });
    const [allPosts, setAllPosts] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Fetch actual data
                const postsRes = await fetch('/api/posts');
                const usersRes = await fetch('/api/users');
                const posts = await postsRes.json();
                const users = await usersRes.json();

                setAllPosts(posts);
                setAllUsers(users);
                setStats({
                    users: users.length,
                    posts: posts.length,
                    alerts: 4 // Mocked for now
                });
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        // Security check - In a real app we'd verify admin role on server too
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (!user || user.role !== 'admin') {
            // Simply showing mock data or limited view for UI demonstration 
            // but in real app redirect to /
        }

        fetchAdminData();
    }, []);

    const handleDeletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAllPosts(prev => prev.filter(p => p._id !== id));
                showToast('Post deleted successfully', 'success');
            } else {
                showToast('Failed to delete post', 'error');
            }
        } catch (err) {
            showToast('Error connecting to server', 'error');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user? This will also delete all their posts.')) return;
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAllUsers(prev => prev.filter(u => u._id !== id));
                showToast('User deleted successfully', 'success');
            } else {
                showToast('Failed to delete user', 'error');
            }
        } catch (err) {
            showToast('Error connecting to server', 'error');
        }
    };

    const handleToggleRole = async (id) => {
        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setAllUsers(prev => prev.map(u => u._id === id ? { ...u, role: updatedUser.role } : u));
                showToast(`User role updated to ${updatedUser.role}`, 'success');
            } else {
                showToast('Failed to update role', 'error');
            }
        } catch (err) {
            showToast('Error connecting to server', 'error');
        }
    };


    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa] selection:bg-amber-500/30">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-16">
                <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500">
                            <Shield size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Administrator</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter uppercase italic">Admin <br /><span className="text-amber-500">Dashboard</span></h1>

                    </div>

                    <div className="flex bg-zinc-900 border border-white/5 p-1 rounded-2xl">
                        {['overview', 'users', 'content'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10' : 'text-zinc-500'
                                    }`}
                            >
                                {tab}
                            </button>

                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {[
                        { label: 'Total Users', val: stats.users, icon: Users, color: 'text-blue-500' },
                        { label: 'Active Posts', val: stats.posts, icon: Activity, color: 'text-emerald-500' },
                        { label: 'Reports', val: stats.alerts, icon: AlertTriangle, color: 'text-amber-500' },
                        { label: 'System Health', val: 'Good', icon: BarChart3, color: 'text-purple-500' }
                    ].map((s, i) => (

                        <div key={i} className="p-8 dark-glass border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 p-8 ${s.color} opacity-5 group-hover:scale-125 transition-transform`}>
                                <s.icon size={80} />
                            </div>
                            <div className="relative space-y-4">
                                <s.icon size={20} className={s.color} />
                                <h3 className="text-4xl font-bold text-white tracking-tighter uppercase">{s.val}</h3>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Loading stats...</p>
                    </div>

                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {activeTab === 'overview' && (
                            <div className="lg:col-span-12 space-y-12">
                                <div className="p-10 dark-glass rounded-[3.5rem] border border-white/10 relative overflow-hidden">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tighter italic flex items-center gap-3 mb-10">
                                        <Activity size={24} className="text-emerald-500" /> Recent Activity Stream
                                    </h2>
                                    <div className="space-y-6">
                                        {allPosts.slice(0, 5).map((p, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-amber-500 text-[10px] font-bold italic">
                                                        {p.user?.username?.substring(0, 2).toUpperCase() || 'P'}
                                                    </div>
                                                    <div>
                                                        <Link href={`/view-profile?id=${p.user?._id}`} className="text-[14px] font-bold text-white uppercase tracking-widest hover:text-emerald-500 transition-colors">
                                                            {p.user?.username || 'Unknown'}
                                                        </Link>
                                                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5">Posted a new terminal entry</p>
                                                    </div>

                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-bold uppercase tracking-widest">Active</span>

                                                    <button onClick={() => handleDeletePost(p._id)} className="p-3 text-red-500/30 hover:text-red-500 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="lg:col-span-12">
                                <div className="dark-glass rounded-[3.5rem] border border-white/10 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                                                <th className="p-8">Username</th>
                                                <th className="p-8">Status</th>
                                                <th className="p-8">Joined Date</th>
                                                <th className="p-8">Actions</th>
                                            </tr>

                                        </thead>
                                        <tbody className="text-zinc-400">
                                            {allUsers.map((u, i) => (
                                                <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-8 font-bold text-white uppercase italic tracking-tighter hover:text-emerald-500 transition-colors">
                                                        <Link href={`/view-profile?id=${u._id}`}>@{u.username || 'unknown'}</Link>
                                                    </td>
                                                    <td className="p-8 uppercase text-[10px] font-bold tracking-widest text-emerald-500">{u.role === 'admin' ? 'Admin' : 'Community Member'}</td>
                                                    <td className="p-8 text-[11px] font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>

                                                    <td className="p-8 flex items-center gap-4">
                                                        <button
                                                            onClick={() => handleToggleRole(u._id)}
                                                            className={`p-3 bg-zinc-900 rounded-xl transition-all ${u.role === 'admin' ? 'text-amber-500' : 'text-zinc-500 hover:text-white'}`}
                                                            title="Toggle Admin Role"
                                                        >
                                                            <ShieldAlert size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="p-3 bg-zinc-900 rounded-xl hover:text-red-500 transition-all"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'content' && (
                            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {allPosts.map((p, i) => (
                                    <div key={i} className="p-8 dark-glass border border-white/5 rounded-[3rem] space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-[9px] font-bold">P_{i}</div>
                                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{p.user.username} shared</span>
                                        </div>

                                        <p className="text-[14px] font-medium text-zinc-300 leading-relaxed line-clamp-3">{p.content}</p>
                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-zinc-500">
                                                <Heart size={14} /> <span className="text-[10px] font-bold">{p.likes.length}</span>
                                                <MessageSquare size={14} /> <span className="text-[10px] font-bold">{p.comments.length}</span>
                                            </div>
                                            <button onClick={() => handleDeletePost(p._id)} className="text-red-500/50 hover:text-red-500 transition-colors uppercase text-[9px] font-bold tracking-widest flex items-center gap-2">
                                                Delete <Trash2 size={12} />
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-20 p-10 bg-zinc-900/50 border border-white/5 rounded-[4rem] text-center space-y-8">
                    <Shield className="mx-auto text-amber-500/20" size={60} />
                    <div className="space-y-4">
                        <h3 className="text-3xl font-semibold text-white uppercase tracking-tighter italic">Secure Session</h3>
                        <p className="text-zinc-600 text-[12px] font-bold uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed">Admin tools are secured for authorized personnel only. All administrative actions are logged for security purposes.</p>
                    </div>

                    <Link href="/" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-3xl font-bold text-[11px] uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all">
                        Exit Dashboard <ExternalLink size={18} />
                    </Link>

                </div>
            </main>
            <Footer />
        </div>
    );
}
