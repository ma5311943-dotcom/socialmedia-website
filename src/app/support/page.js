'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, MessageSquare, Send, Zap,
    Sparkles, AlertCircle, Loader2, LifeBuoy
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/useToast';

export default function SupportPage() {
    const [msg, setMsg] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { showToast } = useToast();

    const handleSend = async (e) => {
        e.preventDefault();
        if (!msg.trim()) return;

        setIsSending(true);
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    userId: user?._id || null
                })
            });

            if (res.ok) {
                showToast('Message sent! Our team will get back to you soon.', 'success');
                setMsg('');
            } else {
                showToast('Failed to send message. Please try again.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error while sending message.', 'error');
        } finally {
            setIsSending(false);
        }
    };


    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <header className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff5c3310] border border-[#ff5c3320] rounded-full text-[#ff5c33]">
                        <Shield size={14} className="animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Help Center</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter uppercase italic">Contact <br /><span className="text-[#ff5c33]">Support</span></h1>
                    <p className="text-[12px] font-medium text-zinc-500 uppercase tracking-[0.2em] max-w-lg leading-relaxed">Our team is here to help. Send us a message and we'll get back to you soon.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-8">
                        <div className="p-10 dark-glass rounded-[3rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5c3310] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-[#ff5c33] text-white flex items-center justify-center">
                                        <LifeBuoy size={20} className="animate-slow-spin" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-white uppercase italic">Support Agent</p>
                                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Active • Online</p>
                                    </div>

                                </div>

                                <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-3">
                                    <p className="text-[13px] text-zinc-300 leading-relaxed font-medium">Hello there! How can we help you with your account or the website today?</p>
                                </div>
                            </div>

                            <form onSubmit={handleSend} className="space-y-6">
                                <div className="relative">
                                    <textarea
                                        value={msg}
                                        onChange={(e) => setMsg(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="w-full h-48 bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 text-[14px] font-medium text-white focus:outline-none focus:border-[#ff5c3350] transition-all resize-none shadow-inner"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending || !msg.trim()}
                                        className="absolute bottom-6 right-6 p-4 bg-[#ff5c33] text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest text-center italic">Your messages are safe and encrypted.</p>

                            </form>
                        </div>
                    </div>

                    <div className="md:col-span-4 space-y-8">
                        <div className="p-8 dark-glass rounded-[2.5rem] border border-white/5 space-y-8 shadow-xl">
                            <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.4em] italic mb-6">Fingertip Access</h2>
                            <div className="space-y-6">
                                {[
                                    { label: 'Latency', val: 'Low', icon: Zap },
                                    { label: 'Uptime', val: '99.9%', icon: Sparkles },
                                    { label: 'Server Load', val: 'Stable', icon: Shield }
                                ].map((item, i) => (

                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <item.icon size={12} className="text-[#ff5c33]" />
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                            <div className="bg-[#ff5c33] w-4/5 h-full animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 border border-[#ff5c3320] bg-[#ff5c3310] rounded-[2.5rem] flex items-center gap-4">
                            <AlertCircle size={24} className="text-[#ff5c33] shrink-0" />
                            <p className="text-[10px] font-bold text-[#ff5c33] uppercase leading-relaxed tracking-widest">High support volume. Response times may be longer than usual.</p>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
