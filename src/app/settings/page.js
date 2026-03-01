'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Shield, Bell, Lock, Eye,
    Smartphone, Moon, Globe, ChevronRight,
    ArrowLeft, Save, Loader2, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/useToast';

export default function SettingsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [settings, setSettings] = useState({
        notifications: true,
        privateProfile: false,
        showEmail: false
    });

    React.useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            setUser(parsed);
            if (parsed.settings) {
                setSettings({
                    notifications: parsed.settings.notifications ?? true,
                    privateProfile: parsed.settings.privateProfile ?? false,
                    showEmail: parsed.settings.showEmail ?? false
                });
            }
            setIsLoading(false);
        }
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/users/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user._id,
                    settings
                })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                showToast('Settings saved successfully.', 'success');
            } else {
                showToast('Failed to save settings.', 'error');
            }
        } catch (err) {
            showToast('Error connecting to server.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const sections = [
        {
            title: 'Account Settings',
            items: [
                { id: 'privateProfile', label: 'Private Profile', icon: Shield, desc: 'Only followers can see your posts' },
                { id: 'showEmail', label: 'Show Email', icon: Eye, desc: 'Display email on your profile' },
                { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Enable push notifications' }
            ]
        }
    ];

    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <header className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400">
                        <Settings size={14} className="animate-spin-slow" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">User Preferences</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter uppercase italic">Account <br /><span className="text-blue-500">Settings</span></h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-4 space-y-4">
                        <Link href="/view-profile" className="flex items-center gap-4 p-6 bg-zinc-900/50 border border-white/5 rounded-3xl group hover:border-white/10 transition-all">
                            <ArrowLeft size={20} className="text-zinc-500 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Back to Profile</span>
                        </Link>

                        <div className="p-8 dark-glass border border-white/5 rounded-[2.5rem] space-y-6">
                            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Storage Status</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                    <span className="text-zinc-500">Local Cache</span>
                                    <span className="text-white">1.2 MB</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[15%]" />
                                </div>
                                <button className="w-full py-3 text-[10px] font-bold text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors text-left">
                                    Clear all cache
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 space-y-12">
                        {sections.map((section, idx) => (
                            <div key={idx} className="space-y-6">
                                <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.4em] ml-6">{section.title}</h2>
                                <div className="grid gap-4">
                                    {section.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleSetting(item.id)}
                                            className={`flex items-center justify-between p-8 bg-[#0c0c0e] border rounded-[2.5rem] group transition-all text-left ${settings[item.id] ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5 hover:border-white/10'}`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${settings[item.id] ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-500 bg-white/5 group-hover:bg-white/10'}`}>
                                                    <item.icon size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-[14px] font-bold text-white uppercase tracking-widest">{item.label}</h3>
                                                    <p className="text-[10px] font-medium text-zinc-600 uppercase mt-1">{item.desc}</p>
                                                </div>
                                            </div>

                                            <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings[item.id] ? 'bg-blue-500' : 'bg-zinc-800'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings[item.id] ? 'left-7' : 'left-1'}`} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="space-y-6">
                            <h2 className="text-[11px] font-bold text-red-500 uppercase tracking-[0.4em] ml-6">Danger Zone</h2>
                            <button
                                onClick={async () => {
                                    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                                        try {
                                            const res = await fetch(`/api/users/${user._id}`, { method: 'DELETE' });
                                            if (res.ok) {
                                                localStorage.clear();
                                                router.push('/SignUp');
                                                showToast('Account deleted successfully.', 'success');
                                            } else {
                                                showToast('Failed to delete account.', 'error');
                                            }
                                        } catch (err) {
                                            showToast('Error connecting to server.', 'error');
                                        }
                                    }
                                }}
                                className="w-full flex items-center justify-between p-8 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] group hover:border-red-500/30 transition-all text-left"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                                        <Trash2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-bold text-white uppercase tracking-widest">Delete Account</h3>
                                        <p className="text-[10px] font-medium text-zinc-600 uppercase mt-1">Permanently remove all your data</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-8 bg-white text-black hover:bg-blue-500 hover:text-white rounded-[2rem] font-bold text-[13px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Save Settings
                                    <Save size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
