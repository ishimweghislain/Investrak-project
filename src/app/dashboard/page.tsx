'use client';

import { useEffect, useState } from 'react';
import { LogOut, User, X, Shield, Building2, LayoutDashboard, BarChart3, MessageCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (error) {
      localStorage.removeItem('token');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    toast.success('Logged out successfully', {
      duration: 2000,
      style: {
        background: '#0a0c10',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    });
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 overflow-x-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Toaster position="top-right" />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={cancelLogout}></div>
          <div className="relative bg-[#161b22] rounded-[32px] shadow-2xl p-6 md:p-10 max-w-sm w-full border border-white/10">
            <button
              onClick={cancelLogout}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">System Logout</h3>
              <p className="text-slate-400 text-sm">
                Terminate your current session?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={cancelLogout}
                className="bg-white/5 text-white px-4 py-3 rounded-xl hover:bg-white/10 transition-all font-bold text-sm"
              >
                Stay
              </button>
              <button
                onClick={confirmLogout}
                className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 font-bold text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="relative z-20 border-b border-white/5 bg-[#0a0c10]/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="text-lg md:text-xl font-bold text-white tracking-tighter">Investrak</span>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-bold truncate max-w-[120px]">{user?.username}</span>
            </div>
            <button
              onClick={handleLogoutClick}
              className="bg-red-600/10 text-red-400 p-2 md:px-3 md:py-1.5 rounded-lg hover:bg-red-600/20 transition-all flex items-center space-x-2 border border-red-500/10 group"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden md:inline font-bold text-xs">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="text-center md:text-left mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Shield className="w-3 h-3" />
            {user?.role === 'ADMIN' ? 'Secure Administrator Portal' : 'Investor Intelligence Node'}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">{user?.role === 'ADMIN' ? 'Commander' : 'Investor'}</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 mb-6 font-light max-w-2xl leading-relaxed">
            Identity verified as <span className="text-white font-medium">{user?.firstName || user?.username}</span>. {user?.role === 'INVESTOR' && <span>Connected via <span className="text-blue-400 font-medium">{user?.company || 'Authorized Enterprise'}</span>.</span>}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="group bg-[#161b22]/40 backdrop-blur-xl rounded-[32px] p-6 md:p-10 border border-white/5 hover:border-blue-500/20 transition-all">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Operational Overview</h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              {user?.role === 'ADMIN'
                ? "Global oversight of the Investrak system. Manage connections, provision accounts, and monitor flow from the registry."
                : "Aggregating real-time data from institutional holdings. Portfolio synchronized with global benchmarks."
              }
            </p>
          </div>

          <div className="bg-[#161b22]/40 backdrop-blur-xl rounded-[32px] p-6 md:p-10 border border-white/5 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Executive Actions</h2>
              <div className="grid grid-cols-1 gap-3">
                {user?.role === 'ADMIN' ? (
                  <>
                    <button
                      onClick={() => window.location.href = '/dashboard/manage-investors'}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 text-sm active:scale-95"
                    >
                      <User className="w-4 h-4" />
                      Manage Registry
                    </button>
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 text-sm">
                      Generate Intel Reports
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 text-sm active:scale-95">
                      Analyze Portfolio
                    </button>
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      Contact Intelligence
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10 border-t border-white/5 text-center md:text-left">
        <p className="text-slate-500 text-xs">© 2026 Investrak Ecosystem. Operational.</p>
      </footer>
    </div>
  );
}
