'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    PlusSquare, Image as ImageIcon, Send, X,
    ArrowLeft, Loader2, Sparkles, Wand2, Shield
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CreatePostPage() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('userInfo');
        if (user) {
            setCurrentUser(JSON.parse(user));
        } else {
            router.push('/Login');
        }
    }, [router]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content && !image) return;
        if (!currentUser) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', content);
        if (image) formData.append('image', image);
        formData.append('userId', currentUser._id);

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                router.push('/explore');
            } else {
                const data = await res.json();
                alert(data.message || 'Error creating post');
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('Failed to connect to the network.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-2xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 md:p-12 dark-glass border border-white/5 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
                >
                    <div className="flex items-center justify-between mb-12">
                        <Link href="/explore" className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div className="text-center">
                            <h1 className="text-3xl font-semibold text-white italic uppercase tracking-tighter">New Post</h1>
                            <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-[0.4em]">Share with Friends</p>
                        </div>

                        <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-2xl text-emerald-500">
                            <Sparkles size={24} className="animate-slow-spin" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Content Area */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.25em] ml-4">What's on your mind?</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full h-40 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 text-white text-[15px] font-medium leading-relaxed placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500/30 transition-all resize-none shadow-inner"
                            />
                        </div>


                        {/* Image Preview / Upload Area */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.25em] ml-4">Add Media</label>


                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-[2.5rem] hover:bg-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group">
                                    <div className="p-5 bg-zinc-900 rounded-3xl mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
                                        <ImageIcon size={32} />
                                    </div>
                                    <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-widest">Upload Media</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            ) : (
                                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 group h-80">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="p-4 bg-red-500 text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Safety Warning */}
                        <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <Shield size={18} className="text-emerald-500" />
                            <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest leading-tight">
                                Your post will be visible to everyone on the Connecto network.
                            </p>
                        </div>


                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || (!content && !image)}
                            className="w-full py-6 md:py-8 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold text-[14px] uppercase tracking-[0.3em] rounded-[2rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-4 group"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    Share Post
                                    <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                </>
                            )}

                        </button>
                    </form>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
