'use client';

import { useEffect, useState } from 'react';
import { LogOut, User, Plus, X, Building2, Shield, Loader2, Edit2, Trash2, ArrowLeft, TrendingUp, DollarSign, Calendar, Save, Bell, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageInvestors() {
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isManagingInvestments, setIsManagingInvestments] = useState(false);
    const [selectedInvestor, setSelectedInvestor] = useState<any>(null);

    // Investor Form Data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        profileImage: ''
    });

    const [fileUploading, setFileUploading] = useState(false);

    // Investment Form Data & State
    const [userInvestments, setUserInvestments] = useState<any[]>([]);
    const [loadingInvestments, setLoadingInvestments] = useState(false);
    const [editingInvestment, setEditingInvestment] = useState<any>(null); // If not null, we are updating
    const [investmentForm, setInvestmentForm] = useState({
        title: '',
        amount: '',
        roi: '',
        maturityDate: '',
        startDate: new Date().toISOString().split('T')[0],
        status: 'PENDING'
    });

    // Notification Form
    const [isSendingNotification, setIsSendingNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

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
                if (response.status !== 403) toast.error('Failed to load investors');
            }
        } catch (error) {
            console.error('Failed to fetch investors:', error);
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
                setInvestors([...investors, data]);
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setFileUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: data
            });
            if (res.ok) {
                const json = await res.json();
                setFormData(prev => ({ ...prev, profileImage: json.url }));
                toast.success('Image uploaded');
            } else {
                toast.error('Upload failed');
            }
        } catch (e) {
            toast.error('Upload network error');
        } finally {
            setFileUploading(false);
        }
    };

    const handleUpdateInvestor = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`/api/admin/investors`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, id: selectedInvestor.id })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Investor updated successfully');
                setInvestors(investors.map(inv => inv.id === selectedInvestor.id ? data : inv));
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

    // Investments Logic
    const openInvestmentsModal = async (investor: any) => {
        setSelectedInvestor(investor);
        setIsManagingInvestments(true);
        setLoadingInvestments(true);
        setEditingInvestment(null); // Reset edit mode

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/investments?userId=${investor.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUserInvestments(data);
            }
        } catch (e) {
            toast.error('Failed to load investments');
        } finally {
            setLoadingInvestments(false);
        }
    };

    const handleSaveInvestment = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            let res;
            if (editingInvestment) {
                // Update
                res = await fetch(`/api/investments?id=${editingInvestment.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(investmentForm)
                });
            } else {
                // Create
                res = await fetch('/api/investments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ userId: selectedInvestor.id, ...investmentForm })
                });
            }

            if (res.ok) {
                const savedInv = await res.json();
                if (editingInvestment) {
                    setUserInvestments(userInvestments.map(i => i.id === savedInv.id ? savedInv : i));
                    toast.success('Investment updated');
                } else {
                    setUserInvestments([savedInv, ...userInvestments]);
                    toast.success('Investment allocated');
                }
                resetInvestmentForm();
            } else {
                toast.error('Failed to save');
            }
        } catch (e) {
            toast.error('Network Error');
        }
    };

    const handleEditInvestment = (inv: any) => {
        setEditingInvestment(inv);
        setInvestmentForm({
            title: inv.title,
            amount: inv.amount.toString(),
            roi: inv.roi ? inv.roi.toString() : '',
            status: inv.status,
            startDate: inv.startDate ? new Date(inv.startDate).toISOString().split('T')[0] : '',
            maturityDate: inv.maturityDate ? new Date(inv.maturityDate).toISOString().split('T')[0] : ''
        });
    };

    const handleDeleteInvestment = async (invId: string) => {
        if (!confirm('Delete this investment?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/investments?id=${invId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setUserInvestments(userInvestments.filter(i => i.id !== invId));
                toast.success('Investment deleted');
                if (editingInvestment?.id === invId) resetInvestmentForm();
            }
        } catch (e) { toast.error('Error deleting'); }
    };

    const resetInvestmentForm = () => {
        setEditingInvestment(null);
        setInvestmentForm({
            title: '',
            amount: '',
            roi: '',
            maturityDate: '',
            startDate: new Date().toISOString().split('T')[0],
            status: 'PENDING'
        });
    };

    // Notification Logic
    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ userId: selectedInvestor.id, message: notificationMessage })
            });
            if (res.ok) {
                toast.success('Notification sent');
                setNotificationMessage('');
                setIsSendingNotification(false);
            } else {
                toast.error('Failed to send');
            }
        } catch (e) {
            toast.error('Error sending');
        }
    };

    const resetForm = () => {
        setFormData({ username: '', company: '', password: '', email: '', profileImage: '' });
        setSelectedInvestor(null);
    };

    const openEditModal = (investor: any) => {
        setSelectedInvestor(investor);
        setFormData({
            username: investor.username,
            company: investor.company || '',
            email: investor.email || '',
            email: investor.email || '',
            password: '',
            profileImage: investor.profileImage || ''
        });
        setIsEditing(true);
    };

    const openDeleteModal = (investor: any) => {
        setSelectedInvestor(investor);
        setIsDeleting(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 p-4 md:p-8 relative overflow-hidden pb-32 transition-colors">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>



            <div className="max-w-7xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-2 group cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-medium">Back to Portal</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Investor Directory
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage institutional access settings</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsAdding(true); }}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-xl shadow-blue-600/20 font-bold text-sm text-white"
                    >
                        <Plus className="w-4 h-4" />
                        Provision Investor
                    </button>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {investors.map((investor) => (
                        <div key={investor.id} className="bg-white dark:bg-[#161b22]/40 border border-slate-200 dark:border-white/5 p-5 rounded-[24px] backdrop-blur-xl hover:shadow-xl dark:hover:bg-[#1c2128]/60 transition-all group relative overflow-hidden flex flex-col h-full shadow-sm">
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
                                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-12">{investor.username}</h3>
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mt-0.5 font-bold uppercase tracking-wider">
                                    <Shield className="w-2.5 h-2.5" />
                                    <span>Investor Account</span>
                                </div>
                            </div>

                            <div className="space-y-3 flex-grow">
                                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Affiliation</p>
                                    <p className="text-slate-700 dark:text-white font-medium truncate text-sm">{investor.company || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <button
                                    onClick={() => openInvestmentsModal(investor)}
                                    className="col-span-2 w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-xl transition-all border border-slate-200 dark:border-white/5 flex items-center justify-center gap-2 text-xs"
                                >
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    Manage Assets
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Manage Investments Modal */}
            {isManagingInvestments && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 dark:bg-[#0a0c10]/90 backdrop-blur-md" onClick={() => setIsManagingInvestments(false)}></div>
                    <div className="relative bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 w-full max-w-5xl max-h-[90vh] rounded-[32px] p-8 overflow-hidden flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Portfolio Management</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Managing assets for <span className="text-blue-600 dark:text-blue-400">{selectedInvestor?.username}</span></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsSendingNotification(!isSendingNotification)} className={`p-2 rounded-full transition-colors ${isSendingNotification ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                                    <Bell className="w-5 h-5" />
                                </button>
                                <button onClick={() => setIsManagingInvestments(false)} className="bg-slate-100 dark:bg-white/5 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Notification Panel */}
                        {isSendingNotification && (
                            <div className="mb-6 bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl animate-in slide-in-from-top-2">
                                <h3 className="text-sm font-bold text-blue-400 mb-2">Send Secure Alert</h3>
                                <form onSubmit={handleSendNotification} className="flex gap-2">
                                    <input autoFocus type="text" className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-3 text-sm focus:border-blue-500/50 outline-none"
                                        placeholder="Message content..." value={notificationMessage} onChange={e => setNotificationMessage(e.target.value)} required />
                                    <button className="bg-blue-600 hover:bg-blue-500 px-4 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors text-white">
                                        <Send className="w-3 h-3" /> Send
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden h-full">
                            {/* Left: Add/Edit */}
                            <div className="lg:col-span-1 bg-slate-50 dark:bg-[#0d1117] p-6 rounded-2xl border border-slate-200 dark:border-white/5 overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        {editingInvestment ? <Edit2 className="w-4 h-4 text-orange-400" /> : <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                        {editingInvestment ? 'Update Asset' : 'Allocate Asset'}
                                    </h3>
                                    {editingInvestment && (
                                        <button onClick={resetInvestmentForm} className="text-[10px] text-slate-500 hover:text-white underline">Cancel Edit</button>
                                    )}
                                </div>
                                <form onSubmit={handleSaveInvestment} className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset Name</label>
                                        <input type="text" className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500/50 outline-none"
                                            value={investmentForm.title} onChange={e => setInvestmentForm({ ...investmentForm, title: e.target.value })} required placeholder="e.g. Tech Growth Fund" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Principal ($)</label>
                                        <input type="number" className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500/50 outline-none"
                                            value={investmentForm.amount} onChange={e => setInvestmentForm({ ...investmentForm, amount: e.target.value })} required placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target ROI (%)</label>
                                        <input type="number" step="0.1" className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500/50 outline-none"
                                            value={investmentForm.roi} onChange={e => setInvestmentForm({ ...investmentForm, roi: e.target.value })} placeholder="0.0" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Start Date</label>
                                            <input type="date" className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500/50 outline-none"
                                                value={investmentForm.startDate} onChange={e => setInvestmentForm({ ...investmentForm, startDate: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Maturity</label>
                                            <input type="date" className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500/50 outline-none"
                                                value={investmentForm.maturityDate} onChange={e => setInvestmentForm({ ...investmentForm, maturityDate: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</label>
                                        <select className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500/50 outline-none"
                                            value={investmentForm.status} onChange={e => setInvestmentForm({ ...investmentForm, status: e.target.value })}>
                                            <option value="PENDING">Pending</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="MATURED">Matured</option>
                                            <option value="CLOSED">Closed</option>
                                        </select>
                                    </div>
                                    <button className={`w-full font-bold py-3 rounded-lg text-sm transition-colors mt-2 ${editingInvestment ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                                        {editingInvestment ? 'Update Asset' : 'Allocate'}
                                    </button>
                                </form>
                            </div>

                            {/* Right: List */}
                            <div className="lg:col-span-2 overflow-y-auto pr-2">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Current Holdings
                                </h3>
                                {loadingInvestments ? <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div> : (
                                    <div className="space-y-3">
                                        {userInvestments.map(inv => (
                                            <div key={inv.id} className={`bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl border flex justify-between items-center group transition-all ${editingInvestment?.id === inv.id ? 'border-orange-500/50 bg-orange-500/5' : 'border-slate-200 dark:border-white/5 hover:border-blue-500/20'}`}>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{inv.title}</h4>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inv.status === 'ACTIVE' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                                            }`}>{inv.status}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {inv.amount.toLocaleString()}</span>
                                                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> ROI: {inv.roi}%</span>
                                                        {inv.maturityDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(inv.maturityDate).toLocaleDateString()}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditInvestment(inv)} className="bg-white/5 p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteInvestment(inv.id)} className="bg-red-500/10 p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {userInvestments.length === 0 && (
                                            <div className="text-center py-10 text-slate-500 text-sm border border-dashed border-white/10 rounded-xl">
                                                No active investments.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Provision/Edit Modal */}
            {(isAdding || isEditing) && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 dark:bg-[#0a0c10]/80 backdrop-blur-md" onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }}></div>
                    <div className="relative bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-[32px] p-8 md:p-10 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
                        <button onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }} className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{isAdding ? 'Provision Investor' : 'Update Profile'}</h2>
                        <form onSubmit={isAdding ? handleCreateInvestor : handleUpdateInvestor} className="space-y-4 mt-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white text-sm" placeholder="Username" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Venture Name</label>
                                <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white text-sm" placeholder="Company" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white text-sm" placeholder="Email (Optional)" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Profile Image</label>
                                <div className="flex items-center gap-4">
                                    {formData.profileImage && (
                                        <img src={formData.profileImage} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                    )}
                                    <label className="cursor-pointer bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        {fileUploading ? 'Uploading...' : 'Choose File'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
                                <input type="password" required={isAdding} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white text-sm" placeholder="••••••••" />
                            </div>
                            <button disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/20 transition-all flex justify-center gap-2 mt-4 text-sm">
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAdding ? 'Confirm Provisioning' : 'Apply Changes')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleting && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 dark:bg-[#0a0c10]/90 backdrop-blur-sm" onClick={() => setIsDeleting(false)}></div>
                    <div className="relative bg-white dark:bg-[#161b22] border border-red-500/20 w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600 dark:text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Revoke Access?</h2>
                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <button onClick={() => setIsDeleting(false)} className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-xl transition-all text-sm">Cancel</button>
                            <button onClick={handleDeleteInvestor} disabled={submitting} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all text-sm">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
