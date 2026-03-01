'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowLeft, Heart, Zap } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function PrivacyPage() {
    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-24">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors uppercase text-[10px] font-bold tracking-[0.2em]">
                            <ArrowLeft size={14} /> Back to Gateway
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic text-white flex items-center gap-6">
                            Privacy <span className="text-emerald-500">Protocol</span>
                        </h1>
                    </div>

                    <div className="p-10 md:p-16 dark-glass border border-white/5 rounded-[3.5rem] space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32" />

                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-4">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 font-mono text-sm">01</div>
                                Data Collection
                            </h2>
                            <p className="text-zinc-400 leading-relaxed font-medium">
                                We prioritize your digital footprint's security. Connecto collects minimal personal information necessary to provide our services, including your username, email, and encrypted password. Media uploaded to our platform is stored securely using industry-standard encryption.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-4">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 font-mono text-sm">02</div>
                                Information Usage
                            </h2>
                            <p className="text-zinc-400 leading-relaxed font-medium">
                                Your data is used exclusively to personalize your experience, facilitate connections, and improve our services. We never sell your personal information to third-party advertisers. Your privacy is not a feature; it's a fundamental right.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-4">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 font-mono text-sm">03</div>
                                Cookie Policy
                            </h2>
                            <p className="text-zinc-400 leading-relaxed font-medium">
                                We use session cookies to maintain your login status and store your preferences locally. These are essential for the platform's functionality and security protocols.
                            </p>
                        </section>

                        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                <Shield className="text-emerald-500" size={24} />
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">End-to-End Encrypted Architecture</p>
                            </div>
                            <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest italic">Last Synced: March 2024</p>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
