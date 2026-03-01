'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    Rocket, Search, Menu, X, Compass, Home,
    Bell, MessageSquare, PlusSquare, User, LogOut, Settings,
    Bookmark, Shield, ChevronDown, Hash, Users, Heart, MessageCircle, AlertTriangle
} from 'lucide-react';

const Navbar = () => {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = () => {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const user = JSON.parse(userInfo);
                setIsLoggedIn(true);
                setIsAdmin(user.role === 'admin');
                setUserName(user.username || 'User');
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        };

        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('lock-scroll');
        } else {
            document.body.classList.remove('lock-scroll');
        }
        return () => document.body.classList.remove('lock-scroll');
    }, [isMobileMenuOpen]);


    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.removeItem('userInfo');
            setIsLoggedIn(false);
            setIsAdmin(false);
            setUserName('');
            setIsMobileMenuOpen(false);
            router.push('/Login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isActive = (path) => pathname === path;

    return (
        <nav className="sticky top-0 z-[100] bg-[#09090b]/70 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 md:px-12 py-4">
            {/* 1. BRAND / LOGO */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[#ff5c33] rounded-lg -rotate-6 transform transition-transform group-hover:rotate-0" />
                        <div className="absolute inset-0 bg-emerald-500 rounded-lg rotate-6 transform transition-transform group-hover:rotate-0" />
                        <Rocket className="relative z-10 text-white w-5 h-5" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[16px] font-semibold text-white tracking-tighter uppercase">Connecto</span>
                        <span className="text-[11px] font-medium text-emerald-500 uppercase tracking-[0.2em] -mt-0.5">Stay Connected</span>
                    </div>

                </div>
            </Link>

            {/* 2. CENTER - DYNAMIC NAVIGATION (Visible only when Logged In) */}
            <div className="hidden lg:flex items-center gap-6">
                {isLoggedIn && (
                    <>
                        <Link href="/" className={`flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-widest transition-all ${isActive('/') ? 'text-[#ff5c33]' : 'text-zinc-400 hover:text-white'}`}>
                            <Home size={14} /> Home
                        </Link>

                        {/* Explore Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 uppercase tracking-widest group-hover:text-emerald-400 transition-colors py-2">
                                <Compass size={14} /> Explore <ChevronDown size={10} />
                            </button>
                            <div className="absolute top-full left-0 w-48 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 mt-1">
                                <Link href="/explore" className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider ${isActive('/explore') ? 'text-emerald-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                    <Compass size={12} /> Feed
                                </Link>


                                <Link href="/trending" className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider ${isActive('/trending') ? 'text-emerald-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                    <Hash size={12} /> Trending
                                </Link>
                                <Link href="/suggested" className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider ${isActive('/suggested') ? 'text-emerald-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                    <Users size={12} /> Suggested
                                </Link>
                            </div>
                        </div>

                        {/* Notifications Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 uppercase tracking-widest group-hover:text-emerald-400 transition-colors py-2">
                                <Bell size={14} /> Notifications <ChevronDown size={10} />
                            </button>
                            <div className="absolute top-full left-0 w-56 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 mt-1">
                                <Link href="/notifications" className={`flex items-center justify-between px-3 py-2 text-[11px] font-medium uppercase tracking-wider ${isActive('/notifications') ? 'text-emerald-400 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'} rounded-lg`}>
                                    <div className="flex items-center gap-2 italic"><Heart size={12} fill="currentColor" /> All Activity</div>
                                </Link>

                                <Link href="/notifications/comments" className={`flex items-center justify-between px-3 py-2 text-[11px] font-medium uppercase tracking-wider ${isActive('/notifications/comments') ? 'text-emerald-400 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'} rounded-lg`}>
                                    <div className="flex items-center gap-2 italic"><MessageCircle size={12} /> Comments</div>
                                </Link>
                                <Link href="/notifications/alerts" className={`flex items-center justify-between px-3 py-2 text-[11px] font-medium uppercase tracking-wider ${isActive('/notifications/alerts') ? 'text-emerald-400 bg-white/5' : 'text-emerald-400 hover:bg-white/5'} rounded-lg`}>
                                    <div className="flex items-center gap-2 italic"><AlertTriangle size={12} /> Alerts</div>
                                </Link>

                            </div>
                        </div>

                        {/* Messages Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 uppercase tracking-widest group-hover:text-emerald-400 transition-colors py-2">
                                <MessageSquare size={14} /> Messages <ChevronDown size={10} />
                            </button>
                            <div className="absolute top-full left-0 w-48 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 mt-1">
                                <Link href="/messages" className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider ${isActive('/messages') ? 'text-emerald-400 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'} rounded-lg`}>
                                    <Users size={12} /> Direct Messages
                                </Link>

                                <Link href="/support" className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider italic ${isActive('/support') ? 'text-[#ff5c33] bg-white/5' : 'text-[#ff5c33] hover:bg-white/5'} rounded-lg`}>
                                    <Shield size={12} /> Help & Support
                                </Link>

                            </div>
                        </div>

                        {/* Create Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-500 uppercase tracking-widest group-hover:text-[#ff5c33] transition-colors py-2">
                                <PlusSquare size={14} /> Create <ChevronDown size={10} />
                            </button>
                            <div className="absolute top-full left-0 w-40 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 mt-1">
                                <Link href="/create-post" className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider ${isActive('/create-post') ? 'text-emerald-400 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'} rounded-lg`}>
                                    Create Post
                                </Link>
                                <Link href="/create-story" className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider ${isActive('/create-story') ? 'text-emerald-400 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'} rounded-lg`}>
                                    Share Story
                                </Link>

                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* 3. RIGHT - SEARCH & LOGIN/SIGNUP/PROFILE */}
            <div className="flex items-center gap-4 shrink-0">
                <Link href="/search" className={`p-2 transition-colors ${isActive('/search') ? 'text-emerald-400' : 'text-zinc-500 hover:text-emerald-400'}`}>
                    <Search size={18} />
                </Link>

                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <Link href="/admin" className="hidden xl:flex items-center gap-1.5 text-[12px] font-semibold text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-tighter hover:bg-amber-500/10 transition-all">
                                <Shield size={14} /> Admin
                            </Link>
                        )}

                        <div className="relative group">
                            <button className="w-10 h-10 bg-zinc-800 rounded-full border border-white/10 overflow-hidden group-hover:border-emerald-500 transition-all flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-white text-[12px] font-semibold italic">
                                    {userName ? userName.substring(0, 2).toUpperCase() : 'UI'}
                                </div>
                            </button>
                            <div className="absolute top-full right-0 w-56 bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-2 p-2">
                                <div className="px-4 py-3 border-b border-white/5 mb-2">
                                    <p className="text-[12px] font-semibold text-white uppercase tracking-tighter">{userName}</p>
                                    <p className="text-[10px] font-medium text-zinc-600 uppercase">Profile Settings</p>
                                </div>

                                <Link href="/view-profile" className={`flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium uppercase tracking-wider ${isActive('/view-profile') ? 'text-[#ff5c33] bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                    <User size={14} /> View Profile
                                </Link>
                                <Link href="/profile/edit" className={`flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium uppercase tracking-wider ${isActive('/profile/edit') ? 'text-[#ff5c33] bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'} rounded-lg`}>
                                    <User size={14} /> Edit Profile
                                </Link>
                                <Link href="/settings" className={`flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium uppercase tracking-wider ${isActive('/settings') ? 'text-[#ff5c33] bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'} rounded-lg`}>
                                    <Settings size={14} /> Account Settings
                                </Link>
                                <Link href="/saved" className={`flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium uppercase tracking-wider ${isActive('/saved') ? 'text-[#ff5c33] bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'} rounded-lg`}>
                                    <Bookmark size={14} /> Bookmarks
                                </Link>
                                <Link href="/feedback" className={`flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium uppercase tracking-wider ${isActive('/feedback') ? 'text-[#ff5c33] bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'} rounded-lg`}>
                                    <MessageSquare size={14} /> Share Feedback
                                </Link>


                                {isAdmin && (
                                    <div className="mt-2 pt-2 border-t border-white/5">
                                        <Link href="/admin" className={`flex items-center gap-3 px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wider italic ${isActive('/admin') ? 'text-amber-500 bg-amber-500/5' : 'text-amber-500 hover:bg-amber-500/5'} rounded-lg`}>
                                            <Shield size={14} /> Admin Dashboard
                                        </Link>
                                    </div>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium text-[#ff5c33] hover:bg-[#ff5c33]/10 rounded-lg uppercase tracking-wider mt-2 pt-2 border-t border-white/5"
                                >
                                    <LogOut size={14} /> Log Out
                                </button>

                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/Login"
                            className="px-6 py-2 border border-white/10 text-white hover:bg-white/5 rounded-full font-medium text-[12px] uppercase tracking-widest transition-all"
                        >
                            Login
                        </Link>
                        <Link
                            href="/SignUp"
                            className="px-6 py-2 bg-[#ff5c33] hover:bg-[#ff4500] text-white rounded-full font-medium text-[12px] uppercase tracking-widest shadow-lg shadow-orange-500/10 active:scale-95 transition-all"
                        >
                            Join Connecto
                        </Link>
                    </div>
                )}

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-zinc-400 hover:text-white transition-all"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* 4. MOBILE DRAWER */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#09090b] border-b border-white/10 lg:hidden animate-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {isLoggedIn ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/" className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-[12px] font-medium uppercase tracking-widest transition-all ${isActive('/') ? 'bg-[#ff5c33]/10 text-[#ff5c33]' : 'bg-zinc-900/50 text-zinc-400'}`}>
                                        <Home size={18} /> Home
                                    </Link>
                                    <Link href="/explore" className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-[12px] font-medium uppercase tracking-widest transition-all ${isActive('/explore') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-900/50 text-zinc-400'}`}>
                                        <Compass size={18} /> Explore
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.3em]">Interactions</p>
                                    <div className="flex flex-col gap-2">
                                        <Link href="/notifications" className="flex items-center gap-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wider">
                                            <Bell size={16} /> Notifications
                                        </Link>
                                        <Link href="/messages" className="flex items-center gap-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wider">
                                            <MessageSquare size={16} /> Messages
                                        </Link>
                                        <Link href="/create-post" className="flex items-center gap-3 text-[12px] font-medium text-emerald-500 uppercase tracking-wider">
                                            <PlusSquare size={16} /> Create Content
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.3em]">Account</p>
                                    <div className="flex flex-col gap-2">
                                        {isAdmin && (
                                            <Link href="/admin" className="flex items-center gap-3 text-[12px] font-semibold text-amber-500 uppercase tracking-wider italic">
                                                <Shield size={16} /> Admin Dashboard
                                            </Link>
                                        )}
                                        <Link href="/view-profile" className="flex items-center gap-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wider">
                                            <User size={16} /> My Profile
                                        </Link>


                                        <button onClick={handleLogout} className="flex items-center gap-3 text-[12px] font-medium text-[#ff5c33] uppercase tracking-wider">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link href="/Login" className="w-full py-4 text-center border border-white/10 text-white rounded-2xl font-medium uppercase tracking-widest">Login to Account</Link>
                                <Link href="/SignUp" className="w-full py-4 text-center bg-[#ff5c33] text-white rounded-2xl font-medium uppercase tracking-widest shadow-xl shadow-orange-500/10">Create Free Account</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;