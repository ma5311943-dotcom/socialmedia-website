'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Send, MessageSquare, User,
    ArrowLeft, Loader2, Sparkles, Smile,
    Paperclip, Check, MoreVertical, Trash2, Shield
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { Suspense } from 'react';

function MessagesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentUser, setCurrentUser] = useState(null);

    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoadingConv, setIsLoadingConv] = useState(true);
    const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial load: setup currentUser and conversations
    useEffect(() => {
        const user = localStorage.getItem('userInfo');
        if (user) {
            const parsed = JSON.parse(user);
            setCurrentUser(parsed);
            fetchConversations(parsed._id);
        } else {
            router.push('/Login');
        }
    }, [router]);

    const fetchConversations = async (userId) => {
        try {
            const res = await fetch(`/api/messages/conversations?userId=${userId}`);
            const data = await res.json();
            if (res.ok) {
                setConversations(data);

                // If we have a userId in the URL, select that user
                const targetId = searchParams.get('userId');
                if (targetId) {
                    const existing = data.find(u => u._id === targetId);
                    if (existing) {
                        handleSelectUser(existing);
                    } else {
                        // Fetch the user data directly since they aren't in current conversations
                        const userRes = await fetch(`/api/users/${targetId}`);
                        const userData = await userRes.json();
                        if (userRes.ok) {
                            handleSelectUser(userData);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Fetch conv error:', err);
        } finally {
            setIsLoadingConv(false);
        }
    };


    const fetchMessages = async (targetUserId) => {
        if (!currentUser || !targetUserId) return;
        try {
            const res = await fetch(`/api/messages?senderId=${currentUser._id}&receiverId=${targetUserId}`);
            const data = await res.json();
            if (res.ok) setMessages(data);
        } catch (err) {
            console.error('Fetch msgs error:', err);
        }
    };

    // Polling effect: fetch messages every 3 seconds if a user is selected
    useEffect(() => {
        let interval;
        if (selectedUser && currentUser) {
            fetchMessages(selectedUser._id);
            interval = setInterval(() => {
                fetchMessages(selectedUser._id);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [selectedUser, currentUser]);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || isSending) return;

        setIsSending(true);
        const textToSend = newMessage;
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: currentUser._id,
                    receiverId: selectedUser._id,
                    content: textToSend
                })
            });

            if (res.ok) {
                setNewMessage('');
                fetchMessages(selectedUser._id);
            }
        } catch (err) {
            console.error('Send message error:', err);
        } finally {
            setIsSending(false);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setMessages([]);
        setIsLoadingMsgs(true);
        fetchMessages(user._id).finally(() => setIsLoadingMsgs(false));
    };

    return (
        <div className="bg-[#09090b] min-h-screen text-[#fafafa] flex flex-col">
            <Navbar />

            <main className="max-w-[1200px] w-full mx-auto px-4 md:px-8 py-6 gap-4 overflow-hidden h-[calc(100vh-100px)] min-h-[500px] flex mb-6">
                {/* Conversations Sidebar */}
                <aside className={`w-full md:w-[320px] flex flex-col transition-all duration-300 bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden shadow-lg ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-bold text-white">Messages</h1>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <MessageSquare size={16} className="text-emerald-400" />
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isLoadingConv ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-50">
                                <Loader2 className="animate-spin text-emerald-500" size={24} />
                                <p className="text-xs text-zinc-500">Loading chats...</p>
                            </div>
                        ) : conversations.length > 0 ? (
                            conversations.map((user) => (
                                <button
                                    key={user._id}
                                    onClick={() => handleSelectUser(user)}
                                    className={`w-full p-4 flex items-center gap-3 transition-colors border-l-2 ${selectedUser?._id === user._id ? 'border-emerald-500 bg-white/5' : 'border-transparent hover:bg-white/5'}`}
                                >
                                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-lg font-bold text-emerald-400 shrink-0 uppercase">
                                        {user.username.substring(0, 2)}
                                    </div>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                                        <p className="text-xs text-zinc-500 truncate">{user.role === 'admin' ? 'Admin' : 'Community Member'}</p>
                                    </div>
                                    {selectedUser?._id === user._id && (
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-60">
                                <MessageSquare className="mx-auto text-zinc-600 mb-2" size={32} />
                                <p className="text-xs text-zinc-500">No chats found.</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Chat Area */}
                <section className={`flex-1 flex flex-col bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-white/5 bg-zinc-900/40 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-lg font-bold text-emerald-500 uppercase">
                                        {selectedUser.username.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">{selectedUser.username}</h3>
                                        <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            Online
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-zinc-400 hover:text-white transition-colors"><Paperclip size={18} /></button>
                                    <button className="p-2 text-zinc-400 hover:text-white transition-colors"><MoreVertical size={18} /></button>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-zinc-950/20">
                                {isLoadingMsgs ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                                    </div>
                                ) : messages.length > 0 ? (
                                    messages.map((m) => {
                                        const isMe = String(m.sender) === String(currentUser._id);
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={m._id}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[75%] md:max-w-[60%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                                                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                                                        : 'bg-zinc-800 border-white/5 text-zinc-200 rounded-tl-sm'
                                                        }`}>
                                                        {m.content}
                                                    </div>
                                                    <div className={`flex items-center gap-1 px-1`}>
                                                        <span className="text-[10px] text-zinc-500">
                                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {isMe && <Check size={12} className="text-emerald-500" />}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-60">
                                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                                            <MessageSquare className="text-zinc-600" size={24} />
                                        </div>
                                        <p className="text-sm text-zinc-400">Say hi to start the conversation.</p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="px-6 py-4 bg-zinc-900/60 border-t border-white/5 flex items-center gap-3">
                                <button type="button" className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors">
                                    <Smile size={24} />
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message"
                                        className="w-full bg-zinc-800/80 border border-white/5 rounded-full py-2.5 px-5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors font-sans"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || isSending}
                                    className="p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-full transition-colors flex items-center justify-center shrink-0"
                                >
                                    {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="ml-px" />}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                                <MessageSquare className="text-zinc-600" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Connecto Messages</h2>
                            <p className="text-sm text-zinc-500 max-w-sm">Select a chat to start messaging or search for a user to start a new conversation.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />

            <style jsx global>{`
                .lock-scroll { overflow: hidden !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.05); border-radius: 10px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>}>
            <MessagesContent />
        </Suspense>
    );
}
