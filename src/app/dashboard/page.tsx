'use client';

import { useEffect, useState } from 'react';
import { LogOut, User, X } from 'lucide-react';
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
      toast.success(`Welcome back, ${payload.firstName || payload.username}!`, {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          color: '#fff',
          border: '1px solid #10b981',
        },
      });
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
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        color: '#fff',
        border: '1px solid #10b981',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <Toaster position="top-right" />
      
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelLogout}></div>
          <div className="relative bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
            <button
              onClick={cancelLogout}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Confirm Logout</h3>
              <p className="text-slate-300">
                Are you sure you want to logout? You will need to login again to access your dashboard.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
      <nav className="relative z-10 flex justify-between items-center p-6 lg:p-8 bg-slate-800/20 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-slate-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">I</span>
          </div>
          <span className="text-2xl font-bold text-white">Investrak</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <User className="w-5 h-5" />
            <span>{user?.username}</span>
          </div>
          <button
            onClick={handleLogoutClick}
            className="bg-red-600/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-all duration-200 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Hello {user?.firstName || user?.username}! You have successfully logged into Investrak.
          </p>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-4">Authentication Successful</h2>
            <p className="text-slate-300">
              This is a simple dashboard to demonstrate that the authentication system is working correctly.
              More features will be added soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
