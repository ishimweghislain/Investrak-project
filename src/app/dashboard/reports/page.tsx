'use client';
import { useEffect, useState } from 'react';
import { Loader2, FileText, Download, ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({ title: '', url: '', type: 'PDF', userId: '' });
    const [investors, setInvestors] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            // Decode basic user info to check role
            const user = JSON.parse(atob(token.split('.')[1]));
            setIsAdmin(user.role === 'ADMIN');
        } catch (e) { }

        fetch('/api/reports', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setReports(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [router]);

    // Fetch investors if admin opens upload modal
    const handleOpenUpload = async () => {
        setShowUpload(true);
        if (investors.length > 0) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/admin/investors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setInvestors(await res.json());
            }
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
                const newReport = await res.json();
                setReports([newReport, ...reports]);
                toast.success('Report uploaded');
                setShowUpload(false);
                setUploadForm({ title: '', url: '', type: 'PDF', userId: '' });
            } else {
                toast.error('Failed to upload');
            }
        } catch (e) {
            toast.error('Error uploading');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] dark:text-white text-slate-900 p-6 pb-24 md:pb-10 md:pt-10 transition-colors">
            <Toaster position="top-right" />

            <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                {isAdmin && (
                    <button onClick={handleOpenUpload} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                        <Upload className="w-4 h-4" /> Upload
                    </button>
                )}
            </div>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Documents & Reports</h1>

                <div className="grid gap-3">
                    {reports.map((doc, i) => (
                        <div key={i} className="bg-[#161b22]/40 hover:bg-[#161b22] p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-blue-200 transition-colors">{doc.title}</h3>
                                    <p className="text-slate-500 text-xs font-mono mt-0.5">
                                        {new Date(doc.createdAt).toLocaleDateString()} • {doc.type}
                                        {isAdmin && doc.user && <span className="text-blue-400 ml-2">For: {doc.user.username}</span>}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {reports.length === 0 && (
                        <div className="text-center py-20 bg-[#161b22]/20 border border-white/5 rounded-3xl">
                            <p className="text-slate-500 font-medium">No reports available.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal for Admin */}
            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0a0c10]/90 backdrop-blur-md" onClick={() => setShowUpload(false)}></div>
                    <div className="relative bg-[#161b22] border border-white/10 w-full max-w-md rounded-[24px] p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Upload Document</h3>
                            <button onClick={() => setShowUpload(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document Title</label>
                                <input type="text" required className="w-full bg-[#0d1117] border border-white/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/50"
                                    value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} placeholder="e.g. Q4 Performance Report" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Doc URL (Mock)</label>
                                <input type="text" required className="w-full bg-[#0d1117] border border-white/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/50"
                                    value={uploadForm.url} onChange={e => setUploadForm({ ...uploadForm, url: e.target.value })} placeholder="http://example.com/report.pdf" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</label>
                                <select className="w-full bg-[#0d1117] border border-white/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/50"
                                    value={uploadForm.type} onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}>
                                    <option>PDF</option>
                                    <option>DOCX</option>
                                    <option>XLSX</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assign to Investor</label>
                                <select required className="w-full bg-[#0d1117] border border-white/5 rounded-lg p-3 text-sm outline-none focus:border-blue-500/50"
                                    value={uploadForm.userId} onChange={e => setUploadForm({ ...uploadForm, userId: e.target.value })}>
                                    <option value="">Select Investor...</option>
                                    {investors.map(inv => (
                                        <option key={inv.id} value={inv.id}>{inv.username} ({inv.company})</option>
                                    ))}
                                </select>
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors mt-2">
                                Upload Document
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
