'use client';

import { useEffect, useState } from 'react';
import { LogOut, User, Plus, X, Building2, Shield, Loader2, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ManageInvestors() {
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedInvestor, setSelectedInvestor] = useState<any>(null);

    const [formData, setFormData] = useState({
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
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Investor created successfully');
                setInvestors([...investors, data.user]);
                setIsAdding(false);
                resetForm();
            } else {
                toast.error(data.message || 'Failed to create investor');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateInvestor = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`/api/admin/investors?id=${selectedInvestor.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Investor updated successfully');
                setInvestors(investors.map(inv => inv.id === selectedInvestor.id ? data.user : inv));
                setIsEditing(false);
                resetForm();
            } else {
                toast.error(data.message || 'Failed to update investor');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteInvestor = async () => {
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`/api/admin/investors?id=${selectedInvestor.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Investor deleted successfully');
                setInvestors(investors.filter(inv => inv.id !== selectedInvestor.id));
                setIsDeleting(false);
                setSelectedInvestor(null);
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to delete investor');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ username: '', company: '', password: '', email: '' });
        setSelectedInvestor(null);
    };

    const openEditModal = (investor: any) => {
        setSelectedInvestor(investor);
        setFormData({
            username: investor.username,
            company: investor.company,
            email: investor.email || '',
            password: ''
        });
        setIsEditing(true);
    };

    const openDeleteModal = (investor: any) => {
        setSelectedInvestor(investor);
        setIsDeleting(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0c10] text-slate-100 p-4 md:p-8 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            <Toaster position="top-right" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-1.5 text-blue-400 mb-2 group cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-medium">Back to Portal</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Investor Directory
                        </h1>
                        <p className="text-slate-400 text-sm mt-0.5">Manage institutional access settings</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsAdding(true); }}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-xl shadow-blue-600/20 font-bold text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Provision Investor
                    </button>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {investors.map((investor) => (
                        <div key={investor.id} className="bg-[#161b22]/40 border border-white/5 p-5 rounded-[24px] backdrop-blur-xl hover:bg-[#1c2128]/60 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                                <button
                                    onClick={() => openEditModal(investor)}
                                    className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 rounded-lg text-blue-400 transition-colors"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => openDeleteModal(investor)}
                                    className="p-1.5 bg-red-600/10 hover:bg-red-600/20 rounded-lg text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600/20 to-slate-600/20 rounded-xl flex items-center justify-center mb-3 border border-white/5">
                                    <Building2 className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white truncate pr-12">{investor.username}</h3>
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mt-0.5 font-bold uppercase tracking-wider">
                                    <Shield className="w-2.5 h-2.5" />
                                    <span>Investor Account</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Affiliation</p>
                                    <p className="text-white font-medium truncate text-sm">{investor.company}</p>
                                </div>

                                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                                    <span>Created</span>
                                    <span>{new Date(investor.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {investors.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center bg-[#161b22]/20 border border-dashed border-white/10 rounded-[32px]">
                            <div className="w-16 h-16 bg-blue-600/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-slate-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">No Profiles</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                No investor accounts provisioned yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Components */}
            {(isAdding || isEditing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0a0c10]/80 backdrop-blur-md" onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }}></div>
                    <div className="relative bg-[#161b22] border border-white/10 w-full max-w-md rounded-[32px] p-8 md:p-10 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
                        <button
                            onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }}
                            className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {isAdding ? 'Provision Investor' : 'Update Profile'}
                        </h2>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            {isAdding ? 'Configure new institutional access.' : 'Modify account security settings.'}
                        </p>

                        <form onSubmit={isAdding ? handleCreateInvestor : handleUpdateInvestor} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username (Primary ID)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-[#0d1117] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-white text-sm placeholder-slate-700 font-medium"
                                    placeholder="e.g. investor_alphonse"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Venture Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full bg-[#0d1117] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-white text-sm placeholder-slate-700 font-medium"
                                    placeholder="e.g. Horizon Equity Partners"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secret Key {isEditing && '(Optional)'}</label>
                                <input
                                    type="password"
                                    required={isAdding}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-[#0d1117] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-white text-sm placeholder-slate-700 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4 text-sm"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAdding ? 'Confirm Provisioning' : 'Apply Changes')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0a0c10]/90 backdrop-blur-sm" onClick={() => setIsDeleting(false)}></div>
                    <div className="relative bg-[#161b22] border border-red-500/20 w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Revoke Access?</h2>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            Permanently delete <span className="text-white font-bold">{selectedInvestor?.username}</span>?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setIsDeleting(false)}
                                className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteInvestor}
                                disabled={submitting}
                                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-xl shadow-red-600/20 flex items-center justify-center text-sm"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
