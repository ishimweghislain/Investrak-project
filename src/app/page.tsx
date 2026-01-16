'use client';

import { useState } from 'react';
import { TrendingUp, Shield, BarChart3, Users, ArrowRight, Lock, User, Eye, EyeOff } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <Toaster position="top-right" />
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-slate-300">Sign in to access your investment dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-slate-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLogin(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                ← Back to welcome page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <nav className="relative z-10 flex justify-between items-center p-6 lg:p-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-slate-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Investrak</span>
        </div>
        <button
          onClick={() => setShowLogin(true)}
          className="bg-gradient-to-r from-blue-600 to-slate-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-slate-700 transition-all duration-200 font-medium"
        >
          Sign In
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
            Smart Investment
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-400">
              Tracking Made Simple
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Take control of your financial future with our comprehensive investment tracking platform. 
            Monitor portfolios, analyze trends, and make informed decisions with real-time data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-gradient-to-r from-blue-600 to-slate-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-slate-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-slate-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-slate-700/50 transition-all duration-200 font-semibold text-lg border border-slate-600">
              Learn More
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:bg-slate-700/50 transition-all duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Analytics</h3>
            <p className="text-slate-300">
              Track your investments with live market data and comprehensive analytics tools.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:bg-slate-700/50 transition-all duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-600 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-slate-300">
              Your financial data is protected with enterprise-grade security and encryption.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:bg-slate-700/50 transition-all duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-slate-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Expert Insights</h3>
            <p className="text-slate-300">
              Access professional analysis and market insights to optimize your investment strategy.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Why Choose Investrak?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-400 mb-2">
                10K+
              </div>
              <p className="text-slate-300">Active Investors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-400 mb-2">
                $50M+
              </div>
              <p className="text-slate-300">Assets Tracked</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-400 mb-2">
                99.9%
              </div>
              <p className="text-slate-300">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-400 mb-2">
                24/7
              </div>
              <p className="text-slate-300">Support</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 Investrak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
