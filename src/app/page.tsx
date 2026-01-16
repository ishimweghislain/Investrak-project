'use client';

import { useState } from 'react';
import { TrendingUp, Shield, BarChart3, Users, ArrowRight, Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading('Authenticating...', {
      style: {
        background: '#0a0c10',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      setTimeout(() => {
        toast.dismiss(loadingToast);

        if (response.ok) {
          localStorage.setItem('token', data.token);
          toast.success('Access Granted.', {
            duration: 1500,
            style: {
              background: '#0a0c10',
              color: '#fff',
              border: '1px solid rgba(59,130,246,0.5)',
            },
          });
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } else {
          toast.error(data.message || 'Authentication Failed', {
            duration: 3000,
            style: {
              background: '#0a0c10',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
            },
          });
        }
      }, 1500);
    } catch (err) {
      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.error('Network failure.', {
          duration: 3000,
          style: {
            background: '#0a0c10',
            color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.2)',
          },
        });
      }, 1500);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 overflow-x-hidden relative">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <Toaster position="top-right" />

        <div className="relative z-10 w-full max-w-[900px] flex flex-col md:flex-row bg-[#161b22]/60 backdrop-blur-3xl rounded-[32px] overflow-hidden border border-white/10 shadow-3xl">
          {/* Left Side - Visual/Info */}
          <div className="hidden lg:flex md:w-5/12 bg-gradient-to-br from-blue-600 to-slate-900 p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-20">
              <div className="flex items-center space-x-2 mb-8">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tighter">Investrak</span>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight mb-4 tracking-tight">
                Secure <br />
                <span className="text-blue-200">Asset Control</span>
              </h2>
              <p className="text-blue-100/70 text-sm max-w-sm leading-relaxed font-light">
                Encrypted terminal for enterprise-level portfolio management.
              </p>
            </div>

            <div className="relative z-20 grid grid-cols-1 gap-3 mt-8 text-sm">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <Shield className="w-5 h-5 text-blue-300 mb-2" />
                <h4 className="text-white font-bold mb-0.5 text-xs">Vault Security</h4>
                <p className="text-blue-100/50 text-[10px] font-medium uppercase tracking-widest">Active</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-[#161b22]/40">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Access Portal</h1>
              <p className="text-slate-400 text-sm font-light">Verification required for entry</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Identity</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#0d1117] border border-white/5 rounded-xl text-white text-sm placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium"
                    placeholder="Username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Secret Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-[#0d1117] border border-white/5 rounded-xl text-white text-sm placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 group text-sm mt-4 active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex flex-col items-center gap-4">
              <button
                onClick={() => setShowLogin(false)}
                className="text-slate-500 hover:text-white text-xs transition-colors flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Surface
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white selection:bg-blue-600/30 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      <nav className="relative z-50 px-6 py-6 max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter">Investrak</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button className="hidden sm:block text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Solutions</button>
          <button
            onClick={() => setShowLogin(true)}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold text-xs backdrop-blur-md active:scale-95"
          >
            Terminal Access
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-12 md:pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in shadow-lg shadow-blue-600/5">
            <Shield className="w-3.5 h-3.5" />
            Institutional Portfolio Infrastructure
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter leading-[1.1]">
            Automate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-slate-400">
              Wealth Strategy
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto mb-12 leading-relaxed font-light">
            Engineered for high-performing institutional managers. Real-time capital intelligence with surgical precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-base transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-2 group active:scale-95"
            >
              Enter Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-[#161b22]/40 hover:bg-[#161b22]/60 border border-white/5 rounded-2xl font-bold text-base transition-all backdrop-blur-xl group">
              Interface Demo
            </button>
          </div>
        </div>

        {/* System Preview */}
        <div className="max-w-5xl mx-auto mt-24 relative">
          <div className="bg-[#161b22]/40 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-3xl">
            <div className="h-8 bg-[#0d1117]/80 border-b border-white/5 flex items-center px-6 gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/30"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/30"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/30"></div>
            </div>
            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { icon: BarChart3, title: 'Quant Intel', desc: 'Predictive market modeling with precision analytics.' },
                { icon: Shield, title: 'Cyber Vault', desc: 'Sovereign security architecture protecting your assets.' },
                { icon: Users, title: 'Multi-Node', desc: 'Manage complex investor structures with granular control.' }
              ].map((feature, i) => (
                <div key={i} className="space-y-4 group">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-500/10">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-light text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2 text-slate-600">
            <TrendingUp className="w-5 h-5" />
            <span className="font-bold tracking-tighter text-lg">Investrak</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            <button className="hover:text-blue-400 transition-colors">Privacy Vault</button>
            <button className="hover:text-blue-400 transition-colors">Legal Framework</button>
            <button className="hover:text-blue-400 transition-colors">Security Node</button>
          </div>
          <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">© 2026 Sovereign Systems</p>
        </div>
      </footer>
    </div>
  );
}
