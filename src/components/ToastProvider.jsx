'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, Zap } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className="flex items-center gap-4 px-6 py-4 bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl min-w-[300px] group backdrop-blur-xl">
                                <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                    toast.type === 'error' ? 'bg-red-500/10 text-red-400' :
                                        'bg-blue-500/10 text-blue-400'
                                    } shadow-inner`}>
                                    {toast.type === 'success' ? <CheckCircle size={18} /> :
                                        toast.type === 'error' ? <AlertCircle size={18} /> :
                                            <Zap size={18} className="animate-pulse" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[12px] font-semibold text-white uppercase tracking-tighter leading-tight">
                                        {toast.type === 'success' ? 'Task Completed' :
                                            toast.type === 'error' ? 'System Error' : 'New Update'}
                                    </p>
                                    <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5">
                                        {toast.message}
                                    </p>
                                </div>

                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1 text-zinc-700 hover:text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                                <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-${toast.type === 'success' ? 'emerald-500' : toast.type === 'error' ? 'red-500' : 'blue-500'}/20 to-transparent`} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
