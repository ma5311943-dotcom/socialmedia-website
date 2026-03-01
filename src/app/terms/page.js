'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, Gavel, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors uppercase text-[10px] font-bold tracking-[0.2em]">
                            <ArrowLeft size={14} /> System Exit
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic text-white">
                            Terms of <span className="text-[#ff5c33]">Service</span>
                        </h1>
                    </div>

                    <div className="p-10 md:p-16 bg-[#0c0c0e]/80 border border-white/5 rounded-[4rem] space-y-12 shadow-2xl">
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-4 italic underline decoration-[#ff5c33] underline-offset-8">
                                01. Engagement
                            </h2>
                            <p className="text-zinc-400 font-medium leading-relaxed uppercase text-[13px] tracking-wider">
                                By accessing Connecto, you agree to comply with our community standard protocols. We provide a space for digital expression, provided it does not infringe upon the safety and privacy of others.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-4 italic underline decoration-[#ff5c33] underline-offset-8">
                                02. Content Responsibility
                            </h2>
                            <p className="text-zinc-400 font-medium leading-relaxed uppercase text-[13px] tracking-wider">
                                Users maintain ownership of their content but grant Connecto a license to display and distribute that content within our network. You are responsible for the legality and impact of the media you share.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-4 italic underline decoration-[#ff5c33] underline-offset-8">
                                03. Account Integrity
                            </h2>
                            <p className="text-zinc-400 font-medium leading-relaxed uppercase text-[13px] tracking-wider">
                                Any attempt to breach system security, impersonate others, or automate abusive behaviors will result in immediate termination of the node (account).
                            </p>
                        </section>

                        <div className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5 flex items-center gap-6 group">
                            <div className="w-12 h-12 bg-[#ff5c33] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/10 group-hover:scale-110 transition-transform">
                                <Gavel size={24} />
                            </div>
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">Connecto reserves the right to modify these protocols at any time to reflect the evolution of our digital community.</p>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
