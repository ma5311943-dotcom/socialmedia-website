'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Camera, Upload, X,
    Sparkles, Shield, Loader2, Play
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/useToast';
import { useRouter } from 'next/navigation';

export default function CreateStoryPage() {
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handlePublish = async () => {
        if (!preview) return;

        const userInfo = localStorage.getItem('userInfo');
        const currentUser = userInfo ? JSON.parse(userInfo) : null;

        if (!currentUser) {
            showToast('Please login to share a story.', 'error');
            return;
        }

        setIsUploading(true);
        try {
            const res = await fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser._id,
                    media: preview // For simplicity, sending base64
                })
            });

            if (res.ok) {
                showToast('Story published successfully! It will be visible for 24 hours.', 'success');
                router.push('/explore');
            } else {
                showToast('Failed to publish story.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error connecting to server.', 'error');
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <header className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                        <Zap size={14} className="animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Story Mode</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter uppercase italic">New <br /><span className="text-emerald-500">Story</span></h1>
                    <p className="text-[12px] font-medium text-zinc-500 uppercase tracking-[0.2em] max-w-sm leading-relaxed">Share a moment that lasts for 24 hours.</p>
                </header>

                <div className="flex justify-center">
                    <div className="w-full max-w-lg">
                        <AnimatePresence mode="wait">
                            {!preview ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="aspect-[9/16] bg-zinc-900 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center space-y-8 group hover:border-emerald-500/20 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-20 h-20 bg-zinc-950 rounded-[2rem] border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-emerald-500 transition-colors shadow-2xl relative z-10">
                                        <Camera size={32} />
                                    </div>
                                    <div className="space-y-3 relative z-10">
                                        <h3 className="text-2xl font-semibold text-white uppercase tracking-tighter italic">Upload Media</h3>
                                        <p className="text-zinc-600 text-[11px] font-bold uppercase tracking-widest leading-relaxed">Images or videos up to 50MB.</p>
                                    </div>
                                    <label className="px-8 py-4 bg-white text-black rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl relative z-10 cursor-pointer">
                                        Select from Phone / PC
                                        <input type="file" className="hidden" onChange={handleFile} accept="image/*,video/*" />
                                    </label>

                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="aspect-[9/16] bg-zinc-900 rounded-[3rem] border border-white/10 overflow-hidden relative group shadow-[0_0_80px_-20px_rgba(16,185,129,0.3)]"
                                >
                                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                                    <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-black italic shadow-2xl">ST</div>
                                            <span className="text-[11px] font-bold text-white uppercase tracking-widest drop-shadow-lg">Story Preview</span>
                                        </div>

                                        <button
                                            onClick={() => setPreview(null)}
                                            className="p-3 bg-black/50 backdrop-blur-md rounded-2xl text-white hover:text-red-500 transition-all border border-white/10"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-12 left-8 right-8 space-y-8 text-center">
                                        <div className="flex items-center gap-3 justify-center text-emerald-400">
                                            <Sparkles size={20} className="animate-slow-spin" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Ready to Share</span>
                                        </div>

                                        <button
                                            onClick={handlePublish}
                                            disabled={isUploading}
                                            className="w-full py-6 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-[2rem] font-bold text-[13px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group shadow-2xl"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    Post Story
                                                    <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </button>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-20 flex flex-col md:flex-row justify-center gap-12 text-center md:text-left opacity-30 group hover:opacity-100 transition-opacity">
                    {[
                        { title: 'Short Life', desc: 'Auto-delete after 24 hours', icon: Play },
                        { title: 'Secure', desc: 'Private and safe sharing', icon: Shield },
                        { title: 'Instant', desc: 'Visible to all followers instantly', icon: Zap }
                    ].map((item, i) => (

                        <div key={i} className="space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-500 group-hover:text-emerald-500 transition-colors">
                                <item.icon size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{item.title}</span>
                            </div>
                            <p className="text-[10px] font-medium text-zinc-700 uppercase">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
