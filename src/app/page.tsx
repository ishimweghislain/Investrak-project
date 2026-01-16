'use client';

import { useState } from 'react';
import { TrendingUp, Shield, BarChart3, Users, ArrowRight, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
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

    // Show loading toast
    const loadingToast = toast.loading('Authenticating...', {
      style: {
        background: 'linear-gradient(135deg, #1e40af 0%, #475569 100%)',
        color: '#fff',
        border: '1px solid #3b82f6',
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

      // Dismiss loading toast after 1.5 seconds
      setTimeout(() => {
        toast.dismiss(loadingToast);

        if (response.ok) {
          localStorage.setItem('token', data.token);
          toast.success('Login successful! Redirecting...', {
            duration: 1500,
            style: {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff',
              border: '1px solid #10b981',
            },
          });
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } else {
          toast.error(data.message || 'Login failed', {
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: '#fff',
              border: '1px solid #ef4444',
            },
          });
        }
      }, 1500);
    } catch (err) {
      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.error('Network error. Please try again.', {
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: '#fff',
            border: '1px solid #ef4444',
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
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <Toaster position="top-right" />

        <div className="relative z-10 w-full max-w-[1100px] flex flex-col md:flex-row bg-[#161b22]/40 backdrop-blur-2xl rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
          {/* Left Side - Visual/Info */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-slate-800 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-20">
              <div className="flex items-center space-x-3 mb-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-white tracking-tight">Investrak</span>
              </div>
              <h2 className="text-5xl font-bold text-white leading-tight mb-6">
                Institutional Grade <br />
                <span className="text-blue-200">Asset Tracking</span>
              </h2>
              <p className="text-blue-100/80 text-lg max-w-md leading-relaxed">
                Experience the next generation of investment management. Secure, transparent, and built for performance.
              </p>
            </div>

            <div className="relative z-20 grid grid-cols-2 gap-6 mt-12">
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <Shield className="w-6 h-6 text-blue-200 mb-2" />
                <h4 className="text-white font-semibold">Secure</h4>
                <p className="text-blue-100/60 text-xs">AES-256 Encryption</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <BarChart3 className="w-6 h-6 text-blue-200 mb-2" />
                <h4 className="text-white font-semibold">Real-time</h4>
                <p className="text-blue-100/60 text-xs">Live Market Sync</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
              <p className="text-slate-400">Please enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#0d1117] border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="Username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-[#0d1117] border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-slate-500 text-sm">
                Secure access for authorized personnel and investors only.
              </p>
              <button
                onClick={() => setShowLogin(false)}
                className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2"
              >
                ← Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-600/5 rounded-full blur-[120px]"></div>
      </div>

      <nav className="relative z-50 flex justify-between items-center px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Investrak</span>
        </div>
        <div className="flex items-center gap-8">
          <button className="hidden md:block text-slate-400 hover:text-white transition-colors">Solutions</button>
          <button className="hidden md:block text-slate-400 hover:text-white transition-colors">Security</button>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-medium backdrop-blur-sm"
          >
            Sign In
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8 animate-fade-in">
            <Shield className="w-4 h-4" />
            Institutional Portfolio Management
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-[1.1]">
            Empower Your <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-slate-400 bg-clip-text text-transparent">
              Financial Strategy
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            The premier platform for high-net-worth investors and institutional managers.
            Real-time analytics, automated reporting, and uncompromising security.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button
              onClick={() => setShowLogin(true)}
              className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Platform Preview */}
        <div className="max-w-6xl mx-auto px-6 mt-32 relative">
          <div className="absolute inset-0 bg-blue-600/20 blur-[150px] -z-10 rounded-full transform scale-75"></div>
          <div className="bg-[#161b22] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative">
            <div className="h-12 bg-[#0d1117] border-b border-white/5 flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
            </div>
            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: BarChart3, title: 'Live Analytics', desc: 'Track your portfolio performance with sub-second latency.' },
                { icon: Shield, title: 'Military Grade', desc: 'End-to-end encryption for all your financial sensitive data.' },
                { icon: Users, title: 'Collaborative', desc: 'Manage multiple investor accounts with granular permissions.' }
              ].map((feature, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-light">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2 text-slate-500">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold text-sm">Investrak &copy; 2024</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <button className="hover:text-white transition-colors">Security FAQ</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
