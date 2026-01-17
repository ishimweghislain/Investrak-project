'use client';
import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InvestmentsPage() {
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        fetch('/api/investments', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setInvestments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [router]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-white p-6 pb-24 md:pb-10 md:pt-10 transition-colors">
            <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Investment Holdings</h1>

                <div className="grid gap-4 md:grid-cols-2">
                    {investments.map((inv) => (
                        <div key={inv.id} className="bg-white dark:bg-[#161b22]/60 backdrop-blur-xl p-6 rounded-[24px] border border-slate-200 dark:border-white/5 hover:shadow-xl hover:border-blue-500/20 transition-all group shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{inv.title}</h3>
                                    <p className="text-xs font-mono text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${inv.status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    inv.status === 'MATURED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                        'bg-slate-500/10 border-slate-500/20 text-slate-400'
                                    }`}>
                                    {inv.status}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-300">Principal</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white text-lg">${inv.amount.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-600/10 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-300">ROI Target</span>
                                    </div>
                                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">{inv.roi ? `${inv.roi}%` : 'TBD'}</span>
                                </div>

                                {inv.maturityDate && (
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-600/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-300">Maturity</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white">{new Date(inv.maturityDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {investments.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-[#161b22]/40 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Holdings</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Your portfolio is currently empty. Contact your administrator to initiate an allocation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
