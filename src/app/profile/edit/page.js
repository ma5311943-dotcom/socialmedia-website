'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User, Camera, Shield, Save, ArrowLeft,
    Loader2, Edit3, Image as ImageIcon, MapPin,
    Link as LinkIcon, Mail
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/useToast';


export default function EditProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        email: '',
        profileImage: ''
    });

    const { showToast } = useToast();


    useEffect(() => {
        const user = localStorage.getItem('userInfo');
        if (user) {
            const parsed = JSON.parse(user);
            setCurrentUser(parsed);
            setFormData({
                username: parsed.username || '',
                bio: parsed.bio || '',
                email: parsed.email || '',
                profileImage: parsed.profileImage || ''
            });

            setIsLoading(false);
        } else {
            router.push('/Login');
        }
    }, [router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/users/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentUser._id,
                    ...formData
                })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                showToast('Profile updated successfully!', 'success');
                router.push('/view-profile');
            } else {
                showToast('Failed to update profile.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error connecting to server.', 'error');
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;

    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <div className="space-y-12">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Link href="/view-profile" className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div className="text-center">
                            <h1 className="text-4xl font-semibold text-white italic uppercase tracking-tighter">Edit Profile</h1>
                            <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-[0.4em]">Personal Information</p>
                        </div>

                        <div className="w-12 h-12" />
                    </div>

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4 space-y-8">
                            <div className="p-8 dark-glass border border-white/5 rounded-[3rem] text-center space-y-6">
                                <label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest block">Profile Photo</label>

                                <div className="relative inline-block group">
                                    <div className="w-32 h-32 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-[2.5rem] flex items-center justify-center text-4xl font-semibold text-white italic shadow-2xl overflow-hidden border-4 border-white/10">
                                        {formData.profileImage ? (
                                            <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            formData.username?.substring(0, 2).toUpperCase() || 'U'
                                        )}
                                    </div>

                                    <label className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera size={24} className="text-white" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData(prev => ({ ...prev, profileImage: reader.result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>

                                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Supports PNG, JPG (Max 5MB)</p>
                            </div>

                            <div className="p-8 dark-glass border border-white/5 rounded-[3rem] space-y-6 text-center">
                                <label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest block">Account Status</label>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[11px] font-semibold text-white uppercase tracking-widest">Active</span>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                    <button type="button" className="text-[10px] font-semibold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors py-2">Deactivate Account</button>
                                    <button type="button" className="text-[10px] font-semibold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors py-2">Delete Profile</button>
                                </div>

                            </div>
                        </div>

                        {/* Fields Section */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="p-10 dark-glass border border-white/10 rounded-[3rem] space-y-10">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] ml-2">
                                            <User size={14} /> Full Name or Username
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium text-[14px] focus:outline-none focus:border-emerald-500/30 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] ml-2">
                                            <Mail size={14} /> Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full bg-zinc-800/20 border border-white/5 rounded-2xl px-6 py-4 text-zinc-500 font-medium text-[14px] cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] ml-2">
                                            <Edit3 size={14} /> About Me
                                        </label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Write something about yourself..."

                                            className="w-full h-32 bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium text-[14px] focus:outline-none focus:border-emerald-500/30 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-6 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-[2rem] font-semibold text-[14px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            Save Information
                                            <Save size={18} className="group-hover:scale-110 transition-transform" />
                                        </>
                                    )}

                                </button>
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-[#ff5c3310] border border-[#ff5c3320] rounded-[2rem]">
                                <Shield size={24} className="text-[#ff5c33]" />
                                <p className="text-[10px] font-medium text-[#ff5c33] uppercase tracking-widest leading-relaxed">
                                    Your information is private and secure. Changes are saved immediately to your profile.
                                </p>
                            </div>

                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
