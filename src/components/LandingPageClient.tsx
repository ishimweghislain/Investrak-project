
'use client';

import Link from 'next/link';
import {
    BarChart3, Shield, CheckCircle, TrendingUp, Users,
    FileText, ArrowRight, Lock, Globe, Mail, MapPin,
    Phone, HelpCircle, AlertTriangle, Menu, X, Facebook, Linkedin, Briefcase
} from 'lucide-react';
import LoginForm from '@/components/LoginForm';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function LandingPageClient({ settings, services, team, testimonials }: any) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initial Defaults if settings are empty
    const heroTitle = settings.home_title || 'Spark Holding Group';
    const heroSubtitle = settings.home_subtitle || 'Operating in Rwanda, we specialize in strategic investments, money lending, and financial advisory services.';

    const heroBg = settings.home_bg && settings.home_bg !== '' ? settings.home_bg : '/hero-bg.png';
    const logoSrc = settings.home_logo && settings.home_logo !== '' ? settings.home_logo : '/spark-logo.png';

    // Address defaults
    const address = settings.contact_address || 'Spark Holding Ltd, Remera KG 182 Street, Amora House, 1st Floor, Door 4, Kigali, Rwanda';
    const email = settings.contact_email || 'info@sparkholding.rw';
    const phone = settings.contact_phone || '+250 788 332 426';
    const website = settings.contact_website || 'www.sparkholding.rw';

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 selection:bg-blue-600 selection:text-white">

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <img src={logoSrc} alt="Logo" className="h-12 w-auto object-contain" />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Home</Link>
                        <Link href="#about" className="hover:text-blue-600 dark:hover:text-white transition-colors">About Us</Link>
                        <Link href="#services" className="hover:text-blue-600 dark:hover:text-white transition-colors">Services</Link>
                        <Link href="#team" className="hover:text-blue-600 dark:hover:text-white transition-colors">Team</Link>
                        <Link href="#contact" className="hover:text-blue-600 dark:hover:text-white transition-colors">Contact</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="hidden md:flex items-center gap-2 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 border border-transparent hover:bg-slate-800 dark:hover:bg-slate-100 px-5 py-2.5 rounded-full transition-all shadow-lg"
                        >
                            <Lock className="w-4 h-4" />
                            Client Portal
                        </button>
                        <button className="md:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setShowLoginModal(true)}>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                <Lock className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>



            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden flex items-center justify-center min-h-[85vh]">
                <div className="absolute inset-0 z-0 select-none">
                    <img src={heroBg} alt="Background" className="w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite]" />
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                </div>

                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-dark rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 border border-white/10 shadow-2xl">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Operating in Rwanda 🇷🇼
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white drop-shadow-2xl">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                            {heroTitle}
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-lg delay-100 animate-fade-in-up">
                        {heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center delay-200 animate-fade-in-up">
                        <Link href="#services" className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/30">
                            Explore Services
                        </Link>
                        <Link href="#contact" className="px-10 py-5 glass-dark text-white rounded-full font-bold hover:bg-white/10 hover:scale-105 transition-all border border-white/20">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section id="about" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">About Us</h2>
                            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400">
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-bold mb-2">Our Mission</h3>
                                    <p>{settings.mission_text || 'To provide accessible financial solutions through ethical money lending and transparent investment tracking.'}</p>
                                </div>
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-bold mb-2">Our Vision</h3>
                                    <p>{settings.vision_text || 'To be the leading partner in personal and corporate financial growth in East Africa.'}</p>
                                </div>
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-bold mb-2">Our Strategy</h3>
                                    <p>{settings.strategy_text || 'Combining rigorous risk assessment with personalized advisory to ensure sustainable returns for our stakeholders.'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300">
                                <TrendingUp className="w-12 h-12 text-blue-500 mb-6 bg-blue-500/10 p-2 rounded-2xl" />
                                <h3 className="font-bold text-2xl mb-2 text-slate-800 dark:text-white">Growth-Oriented</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Trusted strategies delivering consistent annual returns for our partners since inception.</p>
                            </div>
                            <div className="glass p-8 rounded-3xl shadow-xl mt-8 hover:scale-105 transition-transform duration-300">
                                <Shield className="w-12 h-12 text-green-500 mb-6 bg-green-500/10 p-2 rounded-2xl" />
                                <h3 className="font-bold text-2xl mb-2 text-slate-800 dark:text-white">Secure Assets</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Fully asset-backed lending models ensuring safety and reliability for every investment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section id="services" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
                        <p className="text-slate-500 dark:text-slate-400">Comprehensive financial solutions tailored for you.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services && services.length > 0 ? services.map((s: any, i: number) => (
                            <div key={s.id} className="p-8 rounded-3xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group duration-300 delay-100 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-blue-500/30">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{s.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{s.description}</p>
                            </div>
                        )) : (
                            // Default Fallback
                            <>
                                <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/5 p-8 rounded-3xl">
                                    <h3 className="text-xl font-bold mb-3">Money Lending</h3>
                                    <p className="text-slate-500">Fast, competitive loans for personal and business needs.</p>
                                </div>
                                <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/5 p-8 rounded-3xl">
                                    <h3 className="text-xl font-bold mb-3">Finance Advisory</h3>
                                    <p className="text-slate-500">Expert guidance to manage wealth and optimize portfolios.</p>
                                </div>
                                <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/5 p-8 rounded-3xl">
                                    <h3 className="text-xl font-bold mb-3">Investment Tracking</h3>
                                    <p className="text-slate-500">Real-time monitoring of your assets via our secure portal.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section id="team" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16">Meet Our Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {team && team.length > 0 ? team.map((t: any) => (
                            <div key={t.id} className="relative group p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 animate-fade-in-up">
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg rotate-12 group-hover:rotate-0 transition-all">
                                        <Link href={t.linkedinUrl || "#"}><Linkedin className="w-5 h-5" /></Link>
                                    </div>
                                </div>
                                <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-700 group-hover:border-blue-500 transition-colors shadow-lg">
                                    {t.photoUrl ? (
                                        <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                            <Users className="w-12 h-12 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t.name}</h3>
                                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wide uppercase">{t.role}</p>
                            </div>
                        )) : (
                            <p className="text-center col-span-3 text-slate-500">Team members loading...</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {testimonials && testimonials.length > 0 && (
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-16">Client Testimonials</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((t: any, i: number) => (
                                <div key={t.id} className="bg-slate-50 dark:bg-white/5 p-8 rounded-[32px] hover:bg-white dark:hover:bg-white/10 transition-all cursor-default animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                                    <div className="flex items-center gap-4 mb-6">
                                        {t.imageUrl ? <img src={t.imageUrl} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 bg-slate-100 rounded-full"></div>}
                                        <div>
                                            <h4 className="font-bold">{t.clientName}</h4>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 italic">"{t.description}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact */}
            <section id="contact" className="py-24 bg-blue-900 text-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-blue-400 mt-1" />
                                <div>
                                    <h3 className="font-bold mb-1">Our Location</h3>
                                    <p className="text-blue-200 max-w-xs">{address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="w-6 h-6 text-blue-400 mt-1" />
                                <div>
                                    <h3 className="font-bold mb-1">Email Us</h3>
                                    <p className="text-blue-200">{email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="w-6 h-6 text-blue-400 mt-1" />
                                <div>
                                    <h3 className="font-bold mb-1">Call Us</h3>
                                    <p className="text-blue-200">{phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Globe className="w-6 h-6 text-blue-400 mt-1" />
                                <div>
                                    <h3 className="font-bold mb-1">Website</h3>
                                    <p className="text-blue-200">{website}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-6">Send a Message</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const name = formData.get('name');
                            const phone = formData.get('phone');
                            const email = formData.get('email');
                            const message = formData.get('message');

                            const toastId = toast.loading('Sending message...');

                            try {
                                const res = await fetch('/api/contact', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name, phone, email, message })
                                });

                                if (res.ok) {
                                    toast.success('Message sent successfully!', { id: toastId });
                                    (e.target as HTMLFormElement).reset();
                                } else {
                                    toast.error('Failed to send message.', { id: toastId });
                                }
                            } catch (err) {
                                toast.error('Something went wrong.', { id: toastId });
                            }
                        }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input name="name" required className="bg-white/10 border-transparent focus:bg-white/20 p-3 rounded-lg placeholder-white/50 outline-none w-full text-white" placeholder="Full Name" />
                                <input name="phone" className="bg-white/10 border-transparent focus:bg-white/20 p-3 rounded-lg placeholder-white/50 outline-none w-full text-white" placeholder="Phone Number" />
                            </div>
                            <input name="email" required type="email" className="bg-white/10 border-transparent focus:bg-white/20 p-3 rounded-lg placeholder-white/50 outline-none w-full text-white" placeholder="Email Address" />
                            <textarea name="message" required className="bg-white/10 border-transparent focus:bg-white/20 p-3 rounded-lg placeholder-white/50 outline-none w-full min-h-[120px] text-white" placeholder="How can we help?" />
                            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors">Submit Request</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 border-t border-white/10 text-slate-500 text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center bg-black">
                    <p>&copy; {new Date().getFullYear()} {heroTitle}. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                    </div>
                </div>
            </footer>
            <div className="h-20 md:hidden"></div>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#0f141c] border-t border-slate-200 dark:border-white/5 z-40 md:hidden flex items-center justify-around px-2">
                <Link href="#" className="flex flex-col items-center gap-1 p-2 text-blue-600 dark:text-blue-400">
                    <Globe className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Home</span>
                </Link>
                <Link href="#services" className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400">
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Services</span>
                </Link>
                {/* Center FAB for Login */}
                <div className="relative -top-5">
                    <button onClick={() => setShowLoginModal(true)} className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 border-4 border-slate-50 dark:border-slate-900">
                        <Lock className="w-6 h-6" />
                    </button>
                    <span className="absolute -bottom-5 w-full text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">Portal</span>
                </div>
                <Link href="#team" className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400">
                    <Users className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Team</span>
                </Link>
                <Link href="#contact" className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400">
                    <Phone className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Contact</span>
                </Link>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
                    <div className="relative bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl">
                        <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
                        <h3 className="text-2xl font-bold text-white mb-2">Spark Investrak Portal</h3>
                        <p className="text-slate-400 mb-8 border-b border-white/10 pb-4">Secure Client Access</p>
                        <LoginForm />
                    </div>
                </div>
            )}

        </div>
    );
}
