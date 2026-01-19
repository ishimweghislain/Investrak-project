
'use client';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, PieChart, ArrowUpRight, Wallet, ArrowLeft, RefreshCw, Smartphone, CreditCard, Landmark, Send, CheckCircle2, TrendingUp, Users, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PortfolioPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [comparativeProgress, setComparativeProgress] = useState<any[]>([]);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            // Fetch personal investment & transactions
            const invRes = await fetch('/api/investments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const txRes = await fetch('/api/transactions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const progressRes = await fetch('/api/admin/investors/progress', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (invRes.ok && txRes.ok && progressRes.ok) {
                const investments = await invRes.json();
                const transactions = await txRes.json();
                const progressData = await progressRes.json();

                const activeInv = investments.find((i: any) => i.status === 'ACTIVE' || i.status === 'PENDING');
                const payments = transactions.filter((t: any) => t.type === 'PAYMENT');
                const totalPaid = payments.reduce((sum: number, tx: any) => sum + tx.amount, 0);

                setStats({
                    investment: activeInv,
                    totalPaid,
                    progress: activeInv ? Math.min(Math.round((totalPaid / activeInv.amount) * 100 * 10) / 10, 100) : 0,
                    monthlyRequirement: activeInv ? activeInv.amount / 60 : 0
                });
                setComparativeProgress(progressData);
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to sync data');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePayment = async () => {
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            toast.error('Enter a valid amount');
            return;
        }
        if (!paymentMethod) {
            toast.error('Select a payment method');
            return;
        }

        setProcessing(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: 'PAYMENT',
                    amount: paymentAmount,
                    paymentMethod: paymentMethod,
                    description: `Monthly installment via ${paymentMethod}`
                })
            });

            if (res.ok) {
                toast.success('Payment simulated successfully!');
                setIsPaying(false);
                setPaymentAmount('');
                setPaymentMethod('');
                fetchData(); // Refresh progress
            } else {
                toast.error('Payment failed');
            }
        } catch (e) {
            toast.error('Network error');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-white p-4 md:p-8 pb-32 transition-colors">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <button onClick={() => router.back()} className="mb-2 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                            <ArrowLeft className="w-4 h-4" /> Back to Portal
                        </button>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Portfolio Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time installment tracking & progress analysis</p>
                    </div>
                    <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                        <RefreshCw className="w-4 h-4" /> Sync Stats
                    </button>
                </div>

                {!stats?.investment ? (
                    <div className="bg-white dark:bg-[#161b22] p-12 rounded-[32px] border border-slate-200 dark:border-white/5 text-center shadow-sm">
                        <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No Active Portfolio</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Your investment portfolio has not been established yet. Please contact administration.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Stats (Left 2 Columns) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Hero Progress Card */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
                                <div className="absolute top-0 right-0 p-40 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-blue-200 font-bold text-[10px] uppercase tracking-[0.2em] mb-1 block">Total Portfolio Goal</span>
                                            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">RWF {stats.investment.amount.toLocaleString()}</h2>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest block mb-1">Current Progress</span>
                                            <span className="text-2xl font-black">{stats.progress}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span>Maturity Completion</span>
                                            <span className="text-blue-200">RWF {stats.totalPaid.toLocaleString()} Contribution</span>
                                        </div>
                                        <div className="w-full h-4 bg-black/20 rounded-full p-1 overflow-hidden">
                                            <div className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: `${stats.progress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest block mb-1">Monthly Draft</span>
                                            <p className="text-lg font-bold">RWF {stats.monthlyRequirement.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest block mb-1">Timeline</span>
                                            <p className="text-lg font-bold">5 Years</p>
                                        </div>
                                        <div className="hidden md:block bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest block mb-1">Asset Type</span>
                                            <p className="text-lg font-bold">Cash</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="bg-white dark:bg-[#161b22] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Make Installment</h3>
                                        <p className="text-slate-500 text-sm font-medium">Contribute to your portfolio goal</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Select Gateway</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'momo', name: 'MoMo', icon: Smartphone, color: 'hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-500/10' },
                                                { id: 'paypal', name: 'PayPal', icon: Send, color: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10' },
                                                { id: 'card', name: 'Credit Card', icon: CreditCard, color: 'hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10' },
                                                { id: 'bank', name: 'Bank Trans', icon: Landmark, color: 'hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' }
                                            ].map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-sm font-bold ${paymentMethod === method.id
                                                        ? 'border-blue-500 bg-blue-500/5 text-blue-600 shadow-sm'
                                                        : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 ' + method.color}`}
                                                >
                                                    <method.icon className="w-5 h-5" />
                                                    {method.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Installment Amount (RWF)</label>
                                            <div className="relative group">
                                                <input
                                                    type="number"
                                                    value={paymentAmount}
                                                    onChange={e => setPaymentAmount(e.target.value)}
                                                    placeholder={stats.monthlyRequirement.toFixed(0)}
                                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <button
                                                        onClick={() => setPaymentAmount(stats.monthlyRequirement.toFixed(0))}
                                                        className="text-[10px] font-bold text-blue-500 hover:text-blue-600 bg-blue-500/10 px-2 py-1 rounded-md transition-colors"
                                                    >
                                                        SET MONTHLY
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            disabled={processing}
                                            onClick={handlePayment}
                                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white font-bold py-5 rounded-[20px] shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 text-lg"
                                        >
                                            {processing ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    Process Installment
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[10px] text-center text-slate-400 font-medium">Locked for security • End-to-end encrypted • Mock simulation</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comparative Growth (Right Sidebar) */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-[#161b22] p-6 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm sticky top-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Member Insights</h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compare Progress</span>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {comparativeProgress.map((p: any) => (
                                        <div key={p.id} className={`group relative space-y-2 ${p.isCurrentUser ? 'p-3 bg-blue-600/5 rounded-2xl border border-blue-500/10' : ''}`}>
                                            <div className="flex justify-between items-center text-xs">
                                                <div className="flex items-center gap-2">
                                                    {p.profileImage ? (
                                                        <img src={p.profileImage} alt="" className="w-6 h-6 rounded-full object-cover border border-white/10" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                            {p.username.charAt(0)}
                                                        </div>
                                                    )}
                                                    <span className={`font-bold transition-colors ${p.isCurrentUser ? 'text-blue-600 font-black' : 'text-slate-600 dark:text-slate-400'}`}>
                                                        {p.username} {p.isCurrentUser && '(You)'}
                                                    </span>
                                                </div>
                                                <span className={`font-bold ${p.isCurrentUser ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}>{p.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${p.isCurrentUser ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                                    style={{ width: `${p.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}

                                    {comparativeProgress.length === 0 && Array(12).fill(0).map((_, i) => (
                                        <div key={i} className="animate-pulse space-y-2">
                                            <div className="flex justify-between h-4 bg-slate-100 dark:bg-white/5 rounded"></div>
                                            <div className="h-1 bg-slate-100 dark:bg-white/5 rounded"></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-4 bg-slate-50 dark:bg-[#0d1117] rounded-2xl border border-slate-100 dark:border-white/5">
                                    <div className="flex gap-3">
                                        <TrendingUp className="w-5 h-5 text-blue-500 shrink-0" />
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            This chart shows the contribution progress of 12 strategic partners. All data is anonymized and shows commitment levels only.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
