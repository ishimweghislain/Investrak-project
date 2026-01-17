'use client';
import { useEffect, useState } from 'react';
import { Loader2, PieChart, ArrowUpRight, Wallet, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PortfolioPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEquity: 0,
        roi: 0,
        allocation: [] as { name: string; pct: number; color: string }[]
    });
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const res = await fetch('/api/investments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const investments = await res.json();
                calculateStats(investments);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (investments: any[]) => {
        const totalEquity = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);

        // Mock ROI calculation for now since we don't have current value in DB yet
        const totalROI = investments.reduce((sum, inv) => sum + (inv.roi || 0), 0) / (investments.length || 1);

        // Simple mock allocation logic based on titles
        const tech = investments.filter(i => i.title.toLowerCase().includes('tech')).reduce((s, i) => s + i.amount, 0);
        const realEstate = investments.filter(i => i.title.toLowerCase().includes('estate') || i.title.toLowerCase().includes('property')).reduce((s, i) => s + i.amount, 0);
        const crypto = investments.filter(i => i.title.toLowerCase().includes('crypto') || i.title.toLowerCase().includes('bitcoin')).reduce((s, i) => s + i.amount, 0);
        const other = totalEquity - tech - realEstate - crypto;

        const allocation = [
            { name: 'Technology', pct: totalEquity ? Math.round((tech / totalEquity) * 100) : 0, color: 'bg-blue-500' },
            { name: 'Real Estate', pct: totalEquity ? Math.round((realEstate / totalEquity) * 100) : 0, color: 'bg-purple-500' },
            { name: 'Digital Assets', pct: totalEquity ? Math.round((crypto / totalEquity) * 100) : 0, color: 'bg-orange-500' },
            { name: 'Diversified', pct: totalEquity ? Math.round((other / totalEquity) * 100) : 0, color: 'bg-slate-500' },
        ].filter(a => a.pct > 0);

        setStats({
            totalEquity,
            roi: Math.round(totalROI * 10) / 10,
            allocation: allocation.length > 0 ? allocation : [{ name: 'Cash / Pending', pct: 100, color: 'bg-slate-600' }]
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-white p-6 pb-24 md:pb-10 md:pt-10 transition-colors">
            <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Portfolio Analysis</h1>
                    <button onClick={fetchData} className="p-2 bg-slate-200 dark:bg-white/5 rounded-lg hover:bg-slate-300 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Stats Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-8 rounded-[32px] border border-blue-500/20 text-white mb-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="relative z-10">
                        <span className="text-blue-300 font-bold text-xs uppercase tracking-widest mb-2 block">Total Capital Deployed</span>
                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tighter">${stats.totalEquity.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 w-fit px-3 py-1.5 rounded-full border border-green-500/20">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="font-bold text-sm">Avg Target ROI: {stats.roi}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-[#161b22]/40 p-6 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">Visual Breakdown</h3>
                        </div>
                        <div className="aspect-square relative flex items-center justify-center mx-auto mb-4">
                            {/* Simple CSS Pie Chart representation */}
                            <div className="w-48 h-48 rounded-full border-[16px] border-slate-50 dark:border-[#0d1117] relative overflow-hidden"
                                style={{
                                    background: `conic-gradient(
                                        ${stats.allocation.map((a, i, arr) => {
                                        const start = arr.slice(0, i).reduce((sum, item) => sum + item.pct, 0);
                                        const end = start + a.pct;
                                        // Map tailwind colors to hex for gradient (simplified)
                                        const colorMap: any = { 'bg-blue-500': '#3b82f6', 'bg-purple-500': '#a855f7', 'bg-orange-500': '#f97316', 'bg-slate-500': '#64748b', 'bg-slate-600': '#475569' };
                                        return `${colorMap[a.color] || '#333'} ${start}% ${end}%`;
                                    }).join(', ')}
                                    )`
                                }}
                            >
                                <div className="absolute inset-0 m-auto w-24 h-24 bg-[#161b22] rounded-full flex items-center justify-center">
                                    <PieChart className="w-8 h-8 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#161b22]/40 p-6 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <PieChart className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Asset Allocation</h3>
                        </div>
                        <div className="space-y-6">
                            {stats.allocation.map(item => (
                                <div key={item.name}>
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span className="text-slate-500 dark:text-slate-300">{item.name}</span>
                                        <span className="text-slate-900 dark:text-white font-bold">{item.pct}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
                                        <div className={`h-full rounded-full ${item.color} shadow-lg shadow-${item.color.split('-')[1]}-500/50`} style={{ width: `${item.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
