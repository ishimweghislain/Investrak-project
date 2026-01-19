/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import {
    BarChart3, Shield, CheckCircle, TrendingUp, Users,
    FileText, ArrowRight, Lock, Globe, Mail, MapPin,
    Phone, HelpCircle, AlertTriangle, Menu, X, Facebook, Linkedin, Briefcase,
    Sparkles, Award, Target, Zap, MessageSquare
} from 'lucide-react';
import LoginForm from '@/components/LoginForm';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function LandingPageClient({ settings, services, team, testimonials }: any) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

            {/* Enhanced Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-slate-900/5 border-b border-slate-200/50 dark:border-white/5' : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/30 dark:border-white/5'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo Section */}
                        <div className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full group-hover:bg-blue-600/30 transition-all"></div>
                                <img src={logoSrc} alt="Logo" className="relative h-12 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="hidden lg:block">
                                <div className="text-sm font-black tracking-tight text-slate-900 dark:text-white">{heroTitle.split(' ')[0]}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Financial Solutions</div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {[
                                { href: '#', label: 'Home', icon: Globe },
                                { href: '#about', label: 'About', icon: Target },
                                { href: '#services', label: 'Services', icon: Briefcase },
                                { href: '#team', label: 'Team', icon: Users },
                                { href: '#testimonials', label: 'Testimonials', icon: Award },
                                { href: '#contact', label: 'Contact', icon: Phone }
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group relative px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all duration-300 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span>{item.label}</span>
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                                </Link>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="hidden md:flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 dark:text-slate-900 px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-slate-900/20 dark:shadow-white/10 hover:shadow-xl hover:shadow-slate-900/30 dark:hover:shadow-white/20 hover:scale-105 group"
                            >
                                <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span>Client Portal</span>
                                <Sparkles className="w-3 h-3 opacity-50" />
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 shadow-2xl">
                        <div className="px-6 py-4 space-y-1">
                            {[
                                { href: '#', label: 'Home', icon: Globe },
                                { href: '#about', label: 'About', icon: Target },
                                { href: '#services', label: 'Services', icon: Briefcase },
                                { href: '#team', label: 'Team', icon: Users },
                                { href: '#testimonials', label: 'Testimonials', icon: Award },
                                { href: '#contact', label: 'Contact', icon: Phone }
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <item.icon className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-white">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-24 overflow-hidden flex items-center justify-center min-h-[100vh]">
                <div className="absolute inset-0 z-0 select-none">
                    <img src={heroBg} alt="Background" className="w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite]" />
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                </div>

                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-dark rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10 shadow-2xl backdrop-blur-xl">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></span>
                        <span>Operating in Rwanda 🇷🇼</span>
                        <Sparkles className="w-3 h-3" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                            {heroTitle}
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow-lg delay-100 animate-fade-in-up">
                        {heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center delay-200 animate-fade-in-up">
                        <Link href="#services" className="group px-8 py-3.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2">
                            <span>Explore Services</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#contact" className="px-8 py-3.5 glass-dark text-white rounded-full font-bold hover:bg-white/10 hover:scale-105 transition-all border border-white/20 backdrop-blur-xl">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* About Us - Enhanced Cards */}
            <section id="about" className="py-16 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                                    <Target className="w-3 h-3" />
                                    About Us
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Building Financial Success</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        icon: Target,
                                        title: 'Our Mission',
                                        text: settings.mission_text || 'To provide accessible financial solutions through ethical money lending and transparent investment tracking.',
                                        color: 'blue'
                                    },
                                    {
                                        icon: Sparkles,
                                        title: 'Our Vision',
                                        text: settings.vision_text || 'To be the leading partner in personal and corporate financial growth in East Africa.',
                                        color: 'purple'
                                    },
                                    {
                                        icon: Zap,
                                        title: 'Our Strategy',
                                        text: settings.strategy_text || 'Combining rigorous risk assessment with personalized advisory to ensure sustainable returns for our stakeholders.',
                                        color: 'green'
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="group p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2.5 rounded-xl bg-${item.color}-500/10 group-hover:scale-110 transition-transform`}>
                                                <item.icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-base font-bold mb-1.5 text-slate-900 dark:text-white">{item.title}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-500/10 hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                                        <TrendingUp className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-black text-xl mb-2 text-slate-800 dark:text-white">Growth-Oriented</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Trusted strategies delivering consistent annual returns for our partners since inception.</p>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 dark:border-green-500/10 hover:border-green-500/40 dark:hover:border-green-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 mt-6">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 group-hover:rotate-6 transition-transform">
                                        <Shield className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-black text-xl mb-2 text-slate-800 dark:text-white">Secure Assets</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Fully asset-backed lending models ensuring safety and reliability for every investment.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services - Enhanced Modern Cards */}
            <section id="services" className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <Briefcase className="w-3 h-3" />
                            Our Services
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">Comprehensive Solutions</h2>
                        <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Tailored financial services designed to help you achieve your goals</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {services && services.length > 0 ? services.map((s: any, i: number) => (
                            <div key={s.id} className="group relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                        <Briefcase className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{s.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{s.description}</p>
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:gap-3 transition-all">
                                        <span>Learn More</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <>
                                {[
                                    { title: 'Money Lending', desc: 'Fast, competitive loans for personal and business needs.', icon: BarChart3 },
                                    { title: 'Finance Advisory', desc: 'Expert guidance to manage wealth and optimize portfolios.', icon: TrendingUp },
                                    { title: 'Investment Tracking', desc: 'Real-time monitoring of your assets via our secure portal.', icon: Shield }
                                ].map((service, idx) => (
                                    <div key={idx} className="group relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                <service.icon className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white">{service.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{service.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Team - Enhanced Profile Cards */}
            <section id="team" className="py-16 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <Users className="w-3 h-3" />
                            Our Team
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">Meet The Experts</h2>
                        <p className="text-base text-slate-500 dark:text-slate-400">Dedicated professionals committed to your success</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {team && team.length > 0 ? team.map((t: any, idx: number) => (
                            <div key={t.id} className="group relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative text-center">
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                        <Link href={t.linkedinUrl || "#"} className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                                            <Linkedin className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <div className="relative inline-block mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                                        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-700 group-hover:border-blue-500 transition-all duration-300 shadow-xl">
                                            {t.photoUrl ? (
                                                <img src={t.photoUrl} alt={t.name || "Team member"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                                                    <Users className="w-12 h-12 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t.name}</h3>
                                    <div className="inline-block px-3 py-1 bg-blue-600/10 rounded-full">
                                        <p className="text-blue-600 dark:text-blue-400 font-bold text-xs tracking-wide uppercase">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center col-span-3 text-slate-500">Team members loading...</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials - Enhanced Quote Cards */}
            <section id="testimonials" className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <Award className="w-3 h-3" />
                            Testimonials
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">What Clients Say</h2>
                        <p className="text-base text-slate-500 dark:text-slate-400">Real experiences from our valued partners</p>
                    </div>

                    {testimonials && testimonials.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {testimonials.map((t: any, i: number) => (
                                <div key={t.id} className="group relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-white/5 dark:to-blue-500/5 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2" style={{ animationDelay: `${i * 150}ms` }}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="relative">
                                        <div className="absolute -top-1 -left-1 text-5xl text-blue-600/20 font-black">"</div>

                                        <div className="flex items-center gap-3 mb-4 relative z-10">
                                            {t.imageUrl ? (
                                                <img src={t.imageUrl} alt={t.clientName || "Client"} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30 shadow-lg" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm">
                                                    {t.clientName?.charAt(0) || 'C'}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-black text-base text-slate-900 dark:text-white">{t.clientName}</h4>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Award key={idx} className="w-3 h-3 fill-blue-600 text-blue-600" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic relative z-10">&quot;{t.description}&quot;</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No testimonials yet</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Check back soon for client success stories</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact - Enhanced Form Card */}
            <section id="contact" className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <Phone className="w-3 h-3" />
                            Get In Touch
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">Contact Us</h2>
                        <p className="text-base text-blue-200">We're here to help you achieve your financial goals</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Info Cards */}
                        <div className="space-y-4">
                            {[
                                { icon: MapPin, title: 'Our Location', info: address, color: 'blue' },
                                { icon: Mail, title: 'Email Us', info: email, color: 'purple' },
                                { icon: Phone, title: 'Call Us', info: phone, color: 'green' },
                                { icon: Globe, title: 'Website', info: website, color: 'blue' }
                            ].map((item, idx) => (
                                <div key={idx} className="group p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2.5 rounded-xl bg-${item.color}-500/20 group-hover:scale-110 transition-transform`}>
                                            <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-base mb-1.5">{item.title}</h3>
                                            <p className="text-sm text-blue-200 leading-relaxed">{item.info}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Form Card */}
                        <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>

                            <div className="relative">
                                <h3 className="text-xl font-black mb-2">Send a Message</h3>
                                <p className="text-sm text-blue-200 mb-6 pb-4 border-b border-white/10">We'll get back to you within 24 hours</p>

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
                                }} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            name="name"
                                            required
                                            className="bg-white/10 backdrop-blur-sm border border-white/10 focus:bg-white/20 focus:border-white/30 p-3 rounded-xl placeholder-white/50 outline-none w-full text-white text-sm transition-all"
                                            placeholder="Full Name"
                                        />
                                        <input
                                            name="phone"
                                            className="bg-white/10 backdrop-blur-sm border border-white/10 focus:bg-white/20 focus:border-white/30 p-3 rounded-xl placeholder-white/50 outline-none w-full text-white text-sm transition-all"
                                            placeholder="Phone"
                                        />
                                    </div>
                                    <input
                                        name="email"
                                        required
                                        type="email"
                                        className="bg-white/10 backdrop-blur-sm border border-white/10 focus:bg-white/20 focus:border-white/30 p-3 rounded-xl placeholder-white/50 outline-none w-full text-white text-sm transition-all"
                                        placeholder="Email Address"
                                    />
                                    <textarea
                                        name="message"
                                        required
                                        className="bg-white/10 backdrop-blur-sm border border-white/10 focus:bg-white/20 focus:border-white/30 p-3 rounded-xl placeholder-white/50 outline-none w-full min-h-[120px] text-white text-sm transition-all resize-none"
                                        placeholder="How can we help you?"
                                    />
                                    <button
                                        type="submit"
                                        className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <span>Submit Request</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 border-t border-white/10 text-slate-500 text-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <img src={logoSrc} alt="Logo" className="h-8 w-auto object-contain opacity-50" />
                            <div className="h-6 w-px bg-slate-700"></div>
                            <p>&copy; {new Date().getFullYear()} {heroTitle}. All rights reserved.</p>
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Nav */}
            <div className="h-20 md:hidden"></div>
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 z-40 md:hidden shadow-2xl">
                <div className="flex items-center justify-around h-full px-2">
                    <Link href="#" className="flex flex-col items-center gap-1 p-2 text-blue-600 dark:text-blue-400 transition-transform hover:scale-110">
                        <Globe className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>
                    <Link href="#services" className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110">
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Services</span>
                    </Link>

                    {/* Center FAB */}
                    <div className="relative -top-6">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="group w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 border-4 border-white dark:border-slate-950 hover:scale-110 transition-all"
                        >
                            <Lock className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                        </button>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max text-[10px] font-bold text-slate-600 dark:text-slate-400">Portal</span>
                    </div>

                    <Link href="#team" className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110">
                        <Users className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Team</span>
                    </Link>
                    <Link href="#contact" className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110">
                        <Phone className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Contact</span>
                    </Link>
                </div>
            </div>

            {/* Login Modal - Enhanced */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowLoginModal(false)}></div>
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-fade-in-up">
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:rotate-90"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2">Client Portal</h3>
                            <p className="text-slate-400 pb-6 border-b border-white/10">Secure access to your investments</p>
                        </div>

                        <LoginForm />
                    </div>
                </div>
            )}

        </div>
    );
}