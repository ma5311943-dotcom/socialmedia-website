'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Shield, Sparkles, Check, ArrowRight, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PremiumPage() {
    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-24">
                <header className="text-center space-y-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.1)]"
                    >
                        <Crown size={20} className="animate-bounce-subtle" />
                        <span className="text-[12px] font-black uppercase tracking-[0.5em]">Titanium Protocol</span>
                    </motion.div>
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase italic text-white leading-none">
                        Unlock <br /><span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-600 bg-clip-text text-transparent">Premium</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[13px] max-w-xl mx-auto leading-loose italic">
                        Experience the platform without limits. Elevate your digitial existence to the highest tier.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left: Tiers */}
                    <div className="lg:col-span-7 space-y-8">
                        {[
                            { title: 'Verified Badge', desc: 'Secure the Titanium badge next to your node.', icon: Shield },
                            { title: 'Priority Signals', desc: 'Your posts and comments bypass standard queues.', icon: Zap },
                            { title: 'Advanced Analytics', desc: 'Deep dive into your engagement metrics.', icon: Sparkles },
                            { title: 'Custom Themes', desc: 'Personalize your interface with exclusive midnight palettes.', icon: Heart }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] flex items-center gap-8 hover:border-amber-500/30 transition-all group cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-inner">
                                    <feature.icon size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic">{feature.title}</h3>
                                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right: Pricing Card */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-12 md:p-16 bg-gradient-to-b from-zinc-900/50 to-black border-2 border-amber-500/20 rounded-[4.5rem] space-y-12 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(245,158,11,0.15)] group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />

                            <div className="text-center space-y-4">
                                <h2 className="text-[12px] font-black text-amber-500 uppercase tracking-[0.6em]">Midnight Access</h2>
                                <div className="flex items-end justify-center gap-2">
                                    <span className="text-[24px] font-bold text-zinc-600 mb-4">$</span>
                                    <span className="text-[100px] font-bold text-white tracking-tighter leading-none italic">12</span>
                                    <span className="text-[20px] font-bold text-zinc-600 mb-4 uppercase tracking-widest">/mo</span>
                                </div>
                            </div>

                            <ul className="space-y-6">
                                {['All Standard Features', 'Exclusive Premium Icons', 'Titanium Verification Badge', 'Zero Signal Latency', 'Dedicated Private Support'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                                        <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-8 bg-amber-500 hover:bg-amber-600 text-black rounded-[2.5rem] font-black text-[15px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(245,158,11,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-4">
                                Initialize Titanium <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </button>

                            <p className="text-[9px] text-zinc-700 font-bold text-center uppercase tracking-[0.3em]">Cancel any time via core settings.</p>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-32 text-center items-center justify-center flex flex-col space-y-8 opacity-20 hover:opacity-100 transition-opacity">
                    <Star size={40} className="text-amber-500" />
                    <p className="text-[14px] font-medium text-zinc-500 max-w-2xl leading-relaxed uppercase tracking-[0.3em] font-mono">Join over 10,000+ titanium members who have optimized their digital presence.</p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
