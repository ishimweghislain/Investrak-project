
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ShieldCheck, User as UserIcon, Lock, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginForm() {
    const [step, setStep] = useState(0); // 0: Email, 1: Code, 2: Login
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Step 1: Send OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Verification code generated!');
                // Auto-fill in dev mode if returned
                if (data.debugCode) {
                    console.log("[AUTH DEBUG] Verification Code:", data.debugCode);
                    // toast(`Debug Mode: Your code is ${data.debugCode}`, { duration: 6000 });
                }
                setStep(1);
            } else {
                toast.error(data.message || 'Error occurred');
            }
        } catch (e) {
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Email Verified!');
                setStep(2);
            } else {
                toast.error(data.message || 'Invalid code');
            }
        } catch (e) {
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Final Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                toast.success('Access Granted');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);
            } else {
                toast.error(data.message || 'Login failed');
                setLoading(false);
            }
        } catch (e) {
            toast.error('Network error');
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Step Indicators */}
            <div className="flex justify-between mb-8 px-2">
                {[
                    { icon: Mail, label: 'Verify' },
                    { icon: ShieldCheck, label: 'Code' },
                    { icon: Lock, label: 'Secure' }
                ].map((s, i) => (
                    <div key={i} className={`flex flex-col items-center gap-2 transition-opacity ${step >= i ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === i ? 'border-blue-500 bg-blue-500/10 text-blue-400' : step > i ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>
                            {step > i ? <ShieldCheck className="w-5 h-5 text-green-500" /> : <s.icon className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Form Steps */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden transition-all">
                {step === 0 && (
                    <form onSubmit={handleSendOTP} className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Step 1: Verify Email Ownership</label>
                            <div className="relative mt-2">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your-email@example.rw"
                                    className="w-full p-4 pl-12 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-medium"
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-3 font-medium px-1 uppercase tracking-tight">MFA Requirement: A 5-digit security code will be sent to your inbox.</p>
                        </div>
                        <button disabled={loading} className="group w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Verification Code <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>
                )}

                {step === 1 && (
                    <form onSubmit={handleVerifyOTP} className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Step 2: Enter Verification Code</label>
                            <input
                                type="text"
                                required
                                maxLength={5}
                                value={code}
                                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="• • • • •"
                                className="w-full mt-2 p-5 text-center text-4xl font-black tracking-[0.5em] bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-blue-400 placeholder:text-slate-700"
                            />
                            <div className="mt-4 flex justify-between items-center px-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Wait for code (check logs)</span>
                                <button type="button" onClick={() => setStep(0)} className="text-[10px] font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 uppercase">
                                    <RefreshCcw className="w-3 h-3" /> Change Email
                                </button>
                            </div>
                        </div>
                        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Proceed'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleLogin} className="p-6 space-y-5 animate-in slide-in-from-right-4 duration-500">
                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Email Verified: {email}</span>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative mt-1">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full p-4 pl-12 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-white"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full p-4 pl-12 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Final Security Access'}
                        </button>
                    </form>
                )}
            </div>

            <p className="text-center mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-50">Locked with Multi-Step Authentication</p>
        </div>
    );
}
