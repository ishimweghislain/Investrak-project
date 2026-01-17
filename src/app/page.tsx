'use client';

import Link from 'next/link';
import {
    BarChart3, Shield, CheckCircle, TrendingUp, Users,
    FileText, ArrowRight, Lock, Globe, Mail, MapPin,
    Phone, HelpCircle, AlertTriangle
} from 'lucide-react';
import LoginForm from '@/components/LoginForm';
import { useState } from 'react';

export default function LandingPage() {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-600 selection:text-white">

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BarChart3 className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">Investrak</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                        <Link href="#products" className="hover:text-white transition-colors">Investments</Link>
                        <Link href="#transparency" className="hover:text-white transition-colors">Transparency</Link>
                        <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                const el = document.getElementById('login-section');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-full transition-all shadow-lg shadow-blue-600/20"
                        >
                            Client Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <Shield className="w-3 h-3" />
                            Trusted by 500+ Investors
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                            Track your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">investments</span> <br />
                            securely.
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
                            We provide a clear, safe, and easy way to watch your money grow. Get real-time updates, download reports, and rest easy knowing your funds are tracked.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="#products" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-colors">
                                View Plans
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="#contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-colors">
                                Contact Us
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8">
                            <div>
                                <p className="text-3xl font-bold text-white">$25M+</p>
                                <p className="text-sm text-slate-500">Assets Managed</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">500+</p>
                                <p className="text-sm text-slate-500">Happy Investors</p>
                            </div>
                        </div>
                    </div>

                    {/* Login Card Integration in Hero */}
                    <div id="login-section" className="relative">
                        <div className="bg-[#0f141c] border border-white/10 rounded-3xl p-8 shadow-2xl max-w-md mx-auto lg:mx-0">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Client Portal</h3>
                                    <p className="text-sm text-slate-400">Secure Access</p>
                                </div>
                                <Lock className="w-5 h-5 text-blue-500" />
                            </div>
                            <LoginForm />
                            <div className="mt-6 text-center text-xs text-slate-500 pt-6 border-t border-white/5">
                                <p className="flex justify-center items-center gap-2 mb-2">
                                    <Lock className="w-3 h-3" />
                                    256-bit Bank Grade Encryption
                                </p>
                                Need an account? <Link href="#contact" className="text-blue-400 hover:underline">Contact Support</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section className="py-24 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold text-white mb-6">Built on Transparency & Trust</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-4">
                            Investrak was founded to solve a simple problem: investors didn&apos;t know what was happening with their money. We fixed that.
                        </p>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Our mission is to provide complete clarity. We value <b>Safety</b>, <b>Honesty</b>, and <b>Growth</b>. We are a fully registered entity compliant with local financial regulations.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-slate-400">Three simple steps to start earning.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: "1. Create Account", desc: "Contact our team to set up your verified investor profile." },
                            { icon: TrendingUp, title: "2. Choose Plan", desc: "Select an investment product that matches your goals." },
                            { icon: BarChart3, title: "3. Track Growth", desc: "Log in anytime to see your daily profit and download reports." }
                        ].map((step, i) => (
                            <div key={i} className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl hover:bg-slate-800/50 transition-colors">
                                <div className="w-14 h-14 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                                    <step.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Investment Products */}
            <section id="products" className="py-24 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Investment Plans</h2>
                            <p className="text-slate-400 max-w-xl">Curated opportunities designed for steady growth. <span className="text-yellow-500 flex items-center gap-1 mt-2 text-sm"><AlertTriangle className="w-4 h-4" /> All investments carry risk. Read terms carefully.</span></p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "Starter Growth", min: "$5,000", roi: "12% Target", duration: "12 Months", risk: "Low" },
                            { name: "Balanced Yield", min: "$25,000", roi: "18% Target", duration: "24 Months", risk: "Medium" },
                            { name: "High Velocity", min: "$50,000", roi: "24% Target", duration: "36 Months", risk: "High" },
                        ].map((plan, i) => (
                            <div key={i} className="bg-[#0f141c] border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all group">
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="space-y-4 my-8">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Min. Investment</span>
                                        <span className="text-white font-mono">{plan.min}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Duration</span>
                                        <span className="text-white">{plan.duration}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Exp. Return</span>
                                        <span className="text-green-400 font-bold">{plan.roi}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Risk Level</span>
                                        <span className="text-white">{plan.risk}</span>
                                    </div>
                                </div>
                                <button onClick={() => {
                                    const el = document.getElementById('contact');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition-colors">
                                    Contact to Invest
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transparency & Security */}
            <section id="transparency" className="py-24">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Unmatched Transparency</h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="mt-1"><FileText className="w-6 h-6 text-blue-500" /></div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Monthly Audit Reports</h3>
                                    <p className="text-slate-400 text-sm">Every month, we upload detailed performance PDFs directly to your secure dashboard.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1"><Users className="w-6 h-6 text-purple-500" /></div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Verified Partners</h3>
                                    <p className="text-slate-400 text-sm">We work with top-tier auditors and banks to ensure your data is accurate.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Bank-Grade Security</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>256-bit SSL Encryption</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>Secure Data Centers</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>Strict Privacy Policy</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>24/7 Monitoring</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">What Our Investors Say</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { quote: "Finally, a platform that doesn't hide anything. I can see my ROI daily.", author: "Sarah J.", role: "Business Owner" },
                            { quote: "The reporting feature is excellent. My accountant loves the PDF exports.", author: "Michael R.", role: "Real Estate Investor" },
                            { quote: "Secure, fast, and professional support. Highly recommended.", author: "David K.", role: "Tech Entrepreneur" }
                        ].map((t, i) => (
                            <div key={i} className="bg-[#0f141c] p-8 rounded-2xl border border-white/5">
                                <p className="text-slate-300 mb-6 italic">&quot;{t.quote}&quot;</p>
                                <div>
                                    <p className="text-white font-bold">{t.author}</p>
                                    <p className="text-slate-500 text-sm">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Common Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "How do I create an account?", a: "Accounts are invitation-only or strictly vetted. Please use the contact form below to request access." },
                            { q: "Is my investment secure?", a: "We use industry-standard security measures and work with regulated financial partners." },
                            { q: "When can I withdraw?", a: "Withdrawal terms depend on the specific plan you choose. Check key information documents." },
                            { q: "Are there any fees?", a: "Our management fee is transparently listed on every contract. No hidden charges." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-slate-900/30 border border-white/5 p-6 rounded-xl">
                                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                                <p className="text-slate-400 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-24 bg-blue-900/20 border-t border-blue-500/10">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
                        <p className="text-slate-400 mb-8">Ready to start? Have questions? Our team is here to help.</p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                                <span>support@investrak.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center"><Phone className="w-5 h-5" /></div>
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                                <span>123 Finance District, New York, NY</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f141c] p-8 rounded-3xl border border-white/10">
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500" />
                                <input type="text" placeholder="Last Name" className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500" />
                            </div>
                            <input type="email" placeholder="Email Address" className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500" />
                            <textarea rows={4} placeholder="Your Message" className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500"></textarea>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <p>&copy; 2026 Investrak Platform. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white">Terms of Service</Link>
                        <Link href="#" className="hover:text-white">Admin Login</Link>
                    </div>
                </div>
            </footer>

        </div>
    );
}
