
'use client';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, FileText, Download, ArrowLeft, Upload, Plus, X, Calendar, Filter, User, Search, Printer, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({ title: '', url: '', type: 'PDF', userId: '' });
    const [investors, setInvestors] = useState<any[]>([]);
    const [period, setPeriod] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const fetchReports = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const res = await fetch(`/api/reports?period=${period}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReports(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            toast.error('Failed to sync reports');
        } finally {
            setLoading(false);
        }
    }, [router, period]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const user = JSON.parse(atob(token.split('.')[1]));
                setIsAdmin(user.role === 'ADMIN');
            } catch (e) { }
        }
        fetchReports();
    }, [fetchReports]);

    const handleOpenUpload = async () => {
        setShowUpload(true);
        if (investors.length > 0) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/admin/investors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setInvestors(await res.json());
        } catch (e) { }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(uploadForm)
            });

            if (res.ok) {
                toast.success('Report uploaded');
                setShowUpload(false);
                setUploadForm({ title: '', url: '', type: 'PDF', userId: '' });
                fetchReports();
            }
        } catch (e) {
            toast.error('Upload failed');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const filteredReports = reports.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && reports.length === 0) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] dark:text-white text-slate-900 p-4 md:p-8 pb-32 transition-colors">
            <Toaster position="top-right" />

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * { visibility: hidden; }
                    #print-area, #print-area * { visibility: visible; }
                    #print-area { position: absolute; left: 0; top: 0; width: 100%; color: black !important; }
                    button, .no-print { display: none !important; }
                    .dark { background: white !important; color: black !important; }
                    .bg-[#161b22] { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
                }
            `}} />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Top Nav */}
                <div className="flex justify-between items-center no-print">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    {isAdmin && (
                        <button onClick={handleOpenUpload} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                            <Upload className="w-4 h-4" /> Upload Document
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Reports & Ledger</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and download your financial statements</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {['all', 'week', 'month', 'year'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${period === p
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'bg-white dark:bg-white/5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 no-print">
                    <div className="md:col-span-3 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by title or investor name..."
                            className="w-full bg-white dark:bg-[#161b22]/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handlePrint}
                        className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                    >
                        <Printer className="w-4 h-4" /> Print Ledger
                    </button>
                </div>

                {/* Unified List */}
                <div id="print-area" className="space-y-4">
                    <div className="bg-blue-600 p-8 rounded-[32px] mb-8 hidden print:block text-white">
                        <h2 className="text-4xl font-black">Investrak Financial Report</h2>
                        <p className="text-blue-100 font-bold opacity-80 mt-1 uppercase tracking-widest text-xs">Generated on {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="grid gap-4">
                        {filteredReports.map((item, i) => (
                            <div key={i} className="bg-white dark:bg-[#161b22]/40 p-6 rounded-[24px] border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${item.type === 'RECEIPT'
                                        ? 'bg-green-100 dark:bg-green-500/10 text-green-600'
                                        : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600'}`}>
                                        {item.type === 'RECEIPT' ? <CheckCircle2 className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                            <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md text-[10px]">{item.type}</span>
                                            {isAdmin && item.user && (
                                                <span className="flex items-center gap-1.5 text-blue-500"><User className="w-3.5 h-3.5" /> {item.user.username}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => item.url !== '#' ? window.open(item.url) : window.print()}
                                        className="flex-1 md:flex-none bg-slate-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5"
                                    >
                                        Download {item.type}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredReports.length === 0 && !loading && (
                            <div className="py-32 bg-white dark:bg-[#161b22]/20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                    <Filter className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">No Records Found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm mt-1">There are no reports matching your current filter in this period.</p>
                                </div>
                                <button onClick={() => setPeriod('all')} className="text-blue-500 font-bold text-sm hover:underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Modal (Same as before but styled premium) */}
            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0a0c10]/95 backdrop-blur-md" onClick={() => setShowUpload(false)}></div>
                    <div className="relative bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-[32px] p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter">Issue Document</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Assign a new report to a partner</p>
                            </div>
                            <button onClick={() => setShowUpload(false)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl hover:rotate-90 transition-all"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Document Title</label>
                                <input type="text" required className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} placeholder="e.g. Annual Revenue Statement" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Assign User</label>
                                    <select required className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        value={uploadForm.userId} onChange={e => setUploadForm({ ...uploadForm, userId: e.target.value })}>
                                        <option value="">Select...</option>
                                        {investors.map(inv => <option key={inv.id} value={inv.id}>{inv.username}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Doc Type</label>
                                    <select className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        value={uploadForm.type} onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}>
                                        <option>PDF</option>
                                        <option>EXCEL</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Source URL</label>
                                <input type="text" required className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={uploadForm.url} onChange={e => setUploadForm({ ...uploadForm, url: e.target.value })} placeholder="https://cloud.storage/report.pdf" />
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all mt-4">
                                Confirm & Issue Document
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
