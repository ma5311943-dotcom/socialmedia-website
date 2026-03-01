'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Globe, Heart, Zap, Sparkles, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Left: Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors uppercase text-[10px] font-bold tracking-[0.2em]">
                            <ArrowLeft size={14} /> Back to Gateway
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase italic leading-[0.8] text-white">
                            Our <br /><span className="text-emerald-500">Story</span>
                        </h1>
                        <p className="text-zinc-500 font-medium text-lg max-w-sm leading-relaxed italic">
                            Building a specialized bridge for digital souls in a crowded world.
                        </p>
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7 space-y-12"
                    >
                        <div className="p-10 md:p-16 dark-glass border border-white/5 rounded-[4rem] space-y-12 relative overflow-hidden shadow-2xl">
                            <section className="space-y-6">
                                <h3 className="text-[12px] font-bold text-emerald-500 uppercase tracking-[0.5em]">The Mission</h3>
                                <p className="text-xl font-medium text-white leading-relaxed">
                                    Connecto was born from a simple desire: to restore the quality of social interaction. We believe social media should be about people, not algorithms.
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-[12px] font-bold text-emerald-500 uppercase tracking-[0.5em]">The Philosophy</h3>
                                <p className="text-zinc-400 font-medium leading-relaxed">
                                    Our architecture is designed to be premium, fast, and secure. We focus on "Direct Signals"—the real likes, comments, and messages that matter most. No clutter, no distractions, just pure connection.
                                </p>
                            </section>

                            <div className="grid grid-cols-2 gap-6 pt-6">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                                    <Users className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-[12px] font-bold text-white uppercase tracking-widest mb-1">Community First</h4>
                                    <p className="text-[10px] text-zinc-600 font-medium">Built for and by the users.</p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                                    <Zap className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-[12px] font-bold text-white uppercase tracking-widest mb-1">Velocity</h4>
                                    <p className="text-[10px] text-zinc-600 font-medium">Blazing fast real-time updates.</p>
                                </div>
                            </div>

                            <div className="p-10 bg-emerald-500 rounded-[3rem] text-black space-y-4 relative overflow-hidden group">
                                <Sparkles size={100} className="absolute -bottom-4 -right-4 text-black/10 transition-transform group-hover:scale-110" />
                                <h3 className="text-3xl font-bold uppercase italic tracking-tighter leading-none">The Future <br /> is Connected</h3>
                                <p className="text-[11px] font-bold uppercase tracking-wider max-w-xs">Join us as we evolve into the definitive social stack of the next generation.</p>
                                <Link href="/Signup" className="inline-block px-8 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:translate-x-1 transition-transform">
                                    Join The Initiative
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
