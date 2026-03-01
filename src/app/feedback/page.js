'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Star, Send, Loader2,
    Smile, Frown, Meh, Heart, Rocket
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/useToast';

export default function FeedbackPage() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            showToast('Please select a rating.', 'error');
            return;
        }

        setIsSending(true);
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    comment,
                    userId: user?._id || null
                })
            });

            if (res.ok) {
                showToast('Feedback submitted successfully. Thank you!', 'success');
                setRating(0);
                setComment('');
            } else {
                showToast('Failed to submit feedback. Please try again.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error while sending feedback.', 'error');
        } finally {
            setIsSending(false);
        }
    };


    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <header className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                        <MessageSquare size={14} className="animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">User Feedback</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter uppercase italic">Share <br /><span className="text-emerald-500">Feedback</span></h1>
                    <p className="text-[12px] font-medium text-zinc-500 uppercase tracking-[0.2em] max-w-sm leading-relaxed">Help us improve the Connecto experience by sharing your thoughts.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-8">
                        <form onSubmit={handleSubmit} className="p-10 dark-glass rounded-[4rem] border border-white/10 space-y-12 shadow-2xl">
                            <div className="space-y-6">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block text-center">How would you rate your experience?</label>
                                <div className="flex items-center justify-center gap-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <button
                                            type="button"
                                            key={i}
                                            onClick={() => setRating(i)}
                                            className={`p-6 bg-zinc-900 border ${rating >= i ? 'border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/5 text-zinc-700'} rounded-3xl group hover:border-emerald-500/30 transition-all`}
                                        >
                                            <Star size={32} fill={rating >= i ? "currentColor" : "none"} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block pl-6">What can we improve?</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your feedback here..."
                                    className="w-full h-48 bg-zinc-950/50 border border-white/5 rounded-[3rem] p-8 text-white text-[15px] font-medium leading-relaxed placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500/30 transition-all resize-none shadow-inner"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full py-8 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-[2rem] font-bold text-[13px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group shadow-2xl"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Submit Feedback
                                        <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="md:col-span-4 space-y-8">
                        <div className="p-8 border border-white/5 rounded-[3rem] bg-zinc-900/50 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                    <Rocket size={20} />
                                </div>
                                <h3 className="text-[12px] font-bold text-white uppercase tracking-widest italic">Our Goal</h3>
                            </div>
                            <p className="text-[11px] font-medium text-zinc-500 uppercase leading-relaxed tracking-widest">
                                We're dedicated to building a premium, modern social experience. Every piece of feedback help us reach that goal faster.
                            </p>
                            <div className="pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-3 text-zinc-500 italic">
                                    <Heart size={14} className="text-red-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Community Focused</span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-500 italic">
                                    <Smile size={14} className="text-amber-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Premium Quality</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
