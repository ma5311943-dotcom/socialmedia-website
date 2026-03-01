'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Rocket, Share2, MessageCircle, Heart, Users, Zap, Palette, Bell, Sparkles } from 'lucide-react';

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setIsLoggedIn(true);
        }
    }, []);
    return (
        <div className="bg-[#09090b] text-[#fafafa] overflow-hidden relative selection:bg-orange-900/50 selection:text-orange-400 font-sans min-h-screen">

            {/* Dynamic Midnight Background Particles */}
            <div className="absolute top-1/4 -right-1/4 w-[700px] h-[700px] bg-emerald-900/10 rounded-full blur-[150px] animate-slow-spin pointer-events-none" />
            <div className="absolute bottom-1/4 -left-1/4 w-[700px] h-[700px] bg-[#ff5c3315] rounded-full blur-[150px] animate-slow-spin pointer-events-none" />

            {/* Hero Section Container */}
            <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-4 pb-16 md:pt-8 md:pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Large Hero Card - Midnight Gradient Version */}
                <div className="p-8 md:p-16 lg:p-24 bg-gradient-to-br from-[#121214] via-[#09090b] to-[#121214] border border-white/5 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    {/* Moving Shine Effect */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
                        {/* Hero Left Content */}
                        <div className="col-span-1 lg:col-span-6 space-y-12">
                            <div className="space-y-8 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border border-white/5 rounded-full text-emerald-400 shadow-2xl animate-pulse-subtle">
                                    <Sparkles size={14} className="animate-slow-spin" />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Next-Gen Social Stack</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-semibold text-white leading-[0.9] tracking-tighter uppercase whitespace-normal">
                                    Connect, <br /><span className="bg-gradient-to-r from-emerald-400 to-[#ff5c33] bg-clip-text text-transparent italic tracking-normal inline-block animate-pulse">Share</span> & <br />Explore
                                </h1>
                                <p className="text-[16px] text-zinc-500 font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
                                    Join the community built for people who value quality interaction and real digital connections.
                                </p>

                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center lg:justify-start">
                                <Link
                                    href={isLoggedIn ? "/explore" : "/signup"}
                                    className="flex items-center justify-center gap-3 px-10 py-6 bg-emerald-500 hover:bg-emerald-600 text-black rounded-3xl font-semibold text-[14px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/10 text-center"
                                >
                                    {isLoggedIn ? "Go to Feed" : "Start Exploring"}
                                    <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Hero Right Visual - UPDATED FOR MIDNIGHT THEME */}
                        <div className="col-span-1 lg:col-span-6 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-12 duration-1000">
                            <div className="relative w-full max-w-2xl group/img">
                                {/* Shadow Plate underneath */}
                                <div className="absolute top-10 left-10 w-full h-full bg-emerald-500/5 rounded-[4rem] group-hover/img:translate-x-2 group-hover/img:-translate-y-2 transition-transform duration-500 blur-3xl" />

                                {/* Main Image Container */}
                                <div className="relative rounded-[3.5rem] overflow-hidden border-[1px] border-white/10 shadow-[0_0_80px_-20px_rgba(16,185,129,0.3)] animate-float bg-zinc-900/80 flex items-center justify-center p-2">
                                    <Image
                                        src="/assets/bgLandingpage.png"
                                        alt="Platform Preview"
                                        width={1000}
                                        height={1000}
                                        className="w-full h-auto object-contain transform transition-transform duration-700 group-hover/img:scale-105 rounded-[3rem]"
                                        priority
                                    />
                                    {/* Midnight Overlay Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-[#ff5c3310] pointer-events-none" />
                                </div>

                                {/* Floating Floating Micro-badges for premium feel */}
                                <div className="absolute -top-4 -right-4 w-14 h-14 bg-[#ff5c33] text-white rounded-2xl flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(255,92,51,0.5)] animate-bounce-subtle rotate-12">
                                    <Heart size={24} fill="white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modernized Feature Grid - MIDNIGHT VERSION */}
            <section className="py-32 px-6 lg:px-12 bg-[#0c0c0e]/50 border-y border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {[
                        { title: 'Create Posts', desc: 'Securely share your best moments with the world.', bg: 'bg-zinc-900/50', icon: Palette, color: 'text-emerald-400' },
                        { title: 'Grow Network', desc: 'Build your own custom community of friends.', bg: 'bg-zinc-900/50', icon: Users, color: 'text-[#ff5c33]' },
                        { title: 'Real-time Chat', desc: 'Instant private messaging for everyone.', bg: 'bg-zinc-900/50', icon: Zap, color: 'text-yellow-400' },
                        { title: 'Smart Alerts', desc: 'Get notified for every like and comment.', bg: 'bg-zinc-900/50', icon: Bell, color: 'text-blue-400' }
                    ].map((item, i) => (

                        <div key={i} className={`p-10 ${item.bg} hover:bg-zinc-800/80 border border-white/5 rounded-[3rem] shadow-2xl transition-all hover:-translate-y-2 group cursor-pointer relative overflow-hidden`}>
                            {/* Subtle accent glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity ${item.color.replace('text', 'bg')}`} />

                            <div className="w-16 h-16 bg-zinc-950 border border-white/5 rounded-[1.5rem] mb-8 flex items-center justify-center shadow-inner transition-transform group-hover:rotate-12">
                                <item.icon size={30} className={item.color} />
                            </div>
                            <h3 className={`text-2xl font-semibold text-white uppercase tracking-tighter mb-4`}>{item.title}</h3>
                            <p className="text-[14px] text-zinc-500 leading-relaxed font-normal">{item.desc}</p>
                        </div>
                    ))}

                </div>
            </section>

            {/* High-Impact CTA Block */}
            <section className="py-40 px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="text-center space-y-12 max-w-5xl relative">
                    <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tighter uppercase italic leading-[0.8] mix-blend-difference">
                        Connect your <br /><span className="bg-gradient-to-r from-emerald-400 to-[#ff5c33] bg-clip-text text-transparent relative">World</span>
                    </h2>

                    <div className="flex justify-center pt-12">
                        <Link
                            href={isLoggedIn ? "/explore" : "/signup"}
                            className="flex items-center gap-4 px-16 py-7 bg-white hover:bg-[#ff5c33] hover:text-white text-black rounded-full font-semibold text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all active:scale-95 group"
                        >
                            {isLoggedIn ? "Back to Feed" : "Join Now Free"}
                            <Rocket size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                        </Link>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
