
'use client';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft, PieChart as PieIcon, Users, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTheme } from '@/components/ThemeProvider';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminOverviewPage() {
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState<any[]>([]);
    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        fetch('/api/admin/investors/progress', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error(`API returned ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Progress data fetched:', data);
                if (Array.isArray(data)) setProgressData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching progress:', err);
                setLoading(false);
            });
    }, [router]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
    );

    // Prepare chart data
    const chartData = {
        labels: progressData.map(d => d.username),
        datasets: [
            {
                label: 'Payment Progress (%)',
                data: progressData.map(d => d.progress),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(20, 184, 166, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(107, 114, 128, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(14, 165, 233, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                ],
                borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                borderWidth: 2,
            },
        ],
    };

    const totalPortfolio = progressData.reduce((sum, d) => sum + (d.totalPortfolio || d.totalInvestment || 0), 0);
    const totalCollected = progressData.reduce((sum, d) => sum + (d.totalPaid || 0), 0);
    const overallProgress = totalPortfolio > 0 ? (totalCollected / totalPortfolio) * 100 : 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-white p-4 md:p-8 pb-24 transition-colors">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <button onClick={() => router.back()} className="mb-2 flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portal
                        </button>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Executive Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Global payment progress & portfolio health</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Key Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[32px] shadow-2xl shadow-blue-600/20 relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 p-20 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10 space-y-4">
                                <span className="text-blue-100 font-bold text-[10px] uppercase tracking-[0.2em]">Total Portfolio Volume</span>
                                <h2 className="text-3xl font-black">RWF {totalPortfolio.toLocaleString()}</h2>
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-xs font-bold text-blue-100 mb-2">
                                        <span>Collection Progress</span>
                                        <span>{overallProgress.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-[#161b22] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                                <Wallet className="w-5 h-5 text-green-500 mb-3" />
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Total Paid</span>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">RWF {totalCollected.toLocaleString()}</p>
                            </div>
                            <div className="bg-white dark:bg-[#161b22] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                                <Users className="w-5 h-5 text-blue-500 mb-3" />
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Total Investors</span>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{progressData.length}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#161b22] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
                            <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <PieIcon className="w-5 h-5 text-purple-500" />
                                Distribution Analysis
                            </h3>
                            <div className="aspect-square relative">
                                <Pie
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                backgroundColor: theme === 'dark' ? '#1c2128' : '#fff',
                                                titleColor: theme === 'dark' ? '#fff' : '#000',
                                                bodyColor: theme === 'dark' ? '#fff' : '#000',
                                                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                                borderWidth: 1,
                                                titleFont: { size: 12, weight: 'bold' },
                                                bodyFont: { size: 12 },
                                                padding: 12,
                                                cornerRadius: 12,
                                                displayColors: true
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detailed List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-[#161b22] rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                    Investor Progress Ledger
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-[#0d1117] text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-widest">
                                        <tr>
                                            <th className="p-6">Investor</th>
                                            <th className="p-6">Progress</th>
                                            <th className="p-6">Commitment</th>
                                            <th className="p-6 text-right">Contribution</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {progressData.map((investor) => (
                                            <tr key={investor.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        {investor.profileImage ? (
                                                            <img src={investor.profileImage} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                                {investor.username.charAt(0)}
                                                            </div>
                                                        )}
                                                        <span className="font-bold text-slate-900 dark:text-white">{investor.username}</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3 w-32 md:w-48">
                                                        <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                                                style={{ width: `${investor.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{investor.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className="text-slate-500 dark:text-slate-400">RWF {investor.totalInvestment.toLocaleString()}</span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <span className="font-bold text-green-600 dark:text-green-400">RWF {investor.totalPaid.toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
