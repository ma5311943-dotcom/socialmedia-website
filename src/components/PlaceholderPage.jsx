'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Construction, Home } from 'lucide-react';
import Link from 'next/link';

export default function PlaceholderPage({ title = "Module Under Development" }) {
    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa] flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="p-12 dark-glass border border-white/5 rounded-[3rem] max-w-lg space-y-6">
                    <Construction size={64} className="text-emerald-500 mx-auto animate-pulse" />
                    <h1 className="text-4xl font-semibold uppercase tracking-tighter italic">{title}</h1>
                    <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs leading-relaxed">
                        This protocol is currently being synchronized with the global ecosystem. Check back during the next midnight update.
                    </p>
                    <Link href="/explore" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-semibold text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                        <Home size={16} /> Back to Pulse
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
