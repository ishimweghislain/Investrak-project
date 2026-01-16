'use client';

import { useEffect, useState } from 'react';
import { LogOut, User, Plus, X, Building2, Shield, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ManageInvestors() {
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newInvestor, setNewInvestor] = useState({
        username: '',
        company: '',
        password: '',
        email: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInvestors();
    }, []);

    const fetchInvestors = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }

        try {
            const response = await fetch('/api/admin/investors', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setInvestors(data);
            } else {
                toast.error('Failed to fetch investors');
                if (response.status === 401) window.location.href = '/dashboard';
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvestor = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/admin/investors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newInvestor)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Investor created successfully');
                setInvestors([...investors, data.user]);
                setIsAdding(false);
                setNewInvestor({ username: '', company: '', password: '', email: '' });
            } else {
                toast.error(data.message || 'Failed to create investor');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6 lg:p-10">
            <Toaster position="top-right" />

            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Manage Investors
                        </h1>
                        <p className="text-slate-400 mt-2">Create and monitor investor accounts</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-lg shadow-blue-500/20 font-semibold"
                        >
                            <Plus className="w-5 h-5" />
                            Add Investor
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {investors.map((investor) => (
                        <div key={investor.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-blue-500/50 transition-all group backdrop-blur-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <Building2 className="w-6 h-6 text-blue-400 group-hover:text-white" />
                                </div>
                                {investor.role === 'ADMIN' && (
                                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded border border-purple-500/20">
                                        ADMIN
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{investor.username}</h3>
                            <p className="text-slate-400 flex items-center gap-2 mb-4">
                                <Building2 className="w-4 h-4" />
                                {investor.company}
                            </p>
                            <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                                <span className="text-sm text-slate-500">
                                    Joined {new Date(investor.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                                        <Shield className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {investors.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-400">No investors found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mt-2">
                                Click the &quot;Add Investor&quot; button to create your first investor account.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Investor Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsAdding(false)}></div>
                    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="absolute top-6 right-6 text-slate-500 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-3xl font-bold text-white mb-2">New Investor</h2>
                        <p className="text-slate-400 mb-8">Set up a new access account for an investor.</p>

                        <form onSubmit={handleCreateInvestor} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={newInvestor.username}
                                    onChange={(e) => setNewInvestor({ ...newInvestor, username: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    placeholder="e.g. john_investor"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newInvestor.company}
                                    onChange={(e) => setNewInvestor({ ...newInvestor, company: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    placeholder="e.g. Global Capital Inc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newInvestor.password}
                                    onChange={(e) => setNewInvestor({ ...newInvestor, password: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
