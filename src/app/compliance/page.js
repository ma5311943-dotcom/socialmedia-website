'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Heart, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CompliancePage() {
    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="space-y-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 mb-4">
                            <Shield size={14} className="animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Security Standards</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic text-white leading-none">
                            System <br /><span className="text-emerald-500">Compliance</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: 'GDPR Alignment', desc: 'Full transparency on data portability, the right to be forgotten, and user consent management protocols.', icon: ShieldCheck },
                            { title: 'Data Encryption', desc: 'Utilizing AES-256 bit encryption for all stored sensitive credentials and end-to-end security layers.', icon: Lock },
                            { title: 'Fair Access', desc: 'Our moderation protocols are governed by strict neutrality and transparent community guidelines.', icon: Eye },
                            { title: 'Auditing', desc: 'Continuous internal monitoring to identify potential security nodes and optimize platform reliability.', icon: FileText }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 dark-glass border border-white/5 rounded-[3rem] space-y-6 hover:border-emerald-500/30 transition-all group"
                            >
                                <div className="w-14 h-14 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic">{item.title}</h3>
                                <p className="text-[13px] text-zinc-500 font-medium leading-relaxed uppercase tracking-wider">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-12 dark-glass border border-white/5 rounded-[4rem] text-center space-y-8">
                        <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter">Reporting Inconsistencies</h2>
                        <p className="text-zinc-500 font-medium max-w-lg mx-auto leading-relaxed uppercase text-[12px] tracking-widest">
                            If you detect any data anomalies or compliance breaches, please initiate a report via our support portal immediately.
                        </p>
                        <Link href="/support" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl">
                            Support Terminal <Zap size={16} />
                        </Link>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
