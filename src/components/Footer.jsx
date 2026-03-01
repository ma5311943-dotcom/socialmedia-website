import React from 'react';
import Link from 'next/link';
import {
    Facebook, Instagram, Youtube, Mail, Globe, Shield,
    Twitter, Github, Linkedin, ExternalLink, ArrowUpRight,
    MapPin, Phone, Heart
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#09090b] border-t border-white/5 pt-20 pb-10 px-6 md:px-12 text-[#fafafa] overflow-hidden relative">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="space-y-8 col-span-1 lg:col-span-1">
                        <div className="space-y-6">
                            <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
                                <div className="w-10 h-10 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[#ff5c33] rounded-xl -rotate-6 transform group-hover:rotate-0 transition-all duration-300" />
                                    <div className="absolute inset-0 bg-emerald-500 rounded-xl rotate-6 transform group-hover:rotate-0 transition-all duration-300" />
                                    <Globe className="relative z-10 text-white w-5 h-5" />
                                </div>
                                <span className="text-3xl font-semibold text-white tracking-tighter uppercase whitespace-nowrap">Connecto</span>
                            </Link>
                            <p className="text-[14px] text-zinc-500 leading-relaxed font-medium">
                                Share moments with friends safely & easily. Join the community today.
                            </p>

                        </div>

                        <div className="flex items-center gap-4">
                            {[
                                { icon: Facebook, color: 'hover:text-blue-500 hover:bg-blue-500/10', href: 'https://facebook.com' },
                                { icon: Instagram, color: 'hover:text-pink-500 hover:bg-pink-500/10', href: 'https://instagram.com' },
                                { icon: Twitter, color: 'hover:text-sky-400 hover:bg-sky-400/10', href: 'https://twitter.com' },
                                { icon: Github, color: 'hover:text-white hover:bg-white/10', href: 'https://github.com' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 transition-all duration-300 ${social.color}`}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div className="space-y-8">
                        <h4 className="text-[14px] font-semibold text-white uppercase tracking-[0.2em]">Platform</h4>
                        <div className="flex flex-col gap-4">
                            {[
                                { label: 'Explore Feed', href: '/explore' },
                                { label: 'Trending Tags', href: '/trending' },
                                { label: 'Top Members', href: '/suggested' },

                                { label: 'Premium Account', href: '/premium', highlight: true }

                            ].map((link, i) => (
                                <Link key={i} href={link.href} className={`text-[12px] font-medium uppercase tracking-widest flex items-center group transition-colors ${link.highlight ? 'text-emerald-400' : 'text-zinc-500 hover:text-white'}`}>
                                    {link.label}
                                    <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-8">
                        <h4 className="text-[14px] font-semibold text-white uppercase tracking-[0.2em]">Company</h4>
                        <div className="flex flex-col gap-4">
                            {[
                                { label: 'Our Story', href: '/about' },
                                { label: 'Privacy Policy', href: '/privacy' },

                                { label: 'Terms of Service', href: '/terms' },
                                { label: 'Compliance', href: '/compliance' }
                            ].map((link, i) => (
                                <Link key={i} href={link.href} className="text-[12px] font-medium text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center group">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact & Support */}
                    <div className="space-y-8">
                        <h4 className="text-[14px] font-semibold text-white uppercase tracking-[0.2em]">Connect</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl group-hover:bg-[#ff5c33]/10 group-hover:text-[#ff5c33] transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">Global HQ</p>
                                    <p className="text-[12px] font-medium text-zinc-400 uppercase leading-tight">Digital Valley, NV 404</p>
                                </div>
                            </div>
                            <Link href="/support" className="flex items-start gap-4 group cursor-pointer">
                                <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">Help & Support</p>
                                    <p className="text-[12px] font-medium text-zinc-400 uppercase leading-tight group-hover:text-white transition-colors">support@connecto.com</p>
                                </div>

                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.3em]">
                        <Shield size={14} className="text-emerald-500" />
                        Built with security first architecture
                    </div>

                    <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                        © 2024 Connecto. Crafted with <Heart size={10} className="fill-[#ff5c33] text-[#ff5c33]" /> in the Midnight.
                    </p>

                    <div className="flex items-center gap-6">
                        <button className="text-[10px] font-semibold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1 group cursor-pointer">
                            Status <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Background Decorative Blur */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -mb-64 -mr-32" />
        </footer>
    );
};

export default Footer;
