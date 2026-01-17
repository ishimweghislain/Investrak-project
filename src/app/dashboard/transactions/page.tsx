'use client';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft, ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        fetch('/api/transactions', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTransactions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [router]);

    if (loading) return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white p-6 pb-24 md:pb-10 md:pt-10">
            <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Transaction Ledger</h1>

                <div className="grid gap-3">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="bg-[#161b22]/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-blue-500/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'DEPOSIT' || tx.type === 'PROFIT' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {tx.type === 'DEPOSIT' || tx.type === 'PROFIT' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white uppercase tracking-wide text-xs mb-1">{tx.description || tx.type}</h4>
                                    <p className="text-slate-500 text-xs font-mono">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="flex justify-between sm:block text-right">
                                <span className={`block text-lg font-bold ${tx.type === 'DEPOSIT' || tx.type === 'PROFIT' ? 'text-green-400' : 'text-white'
                                    }`}>
                                    {tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount.toLocaleString()}
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-white/5 px-2 py-0.5 rounded ml-auto w-fit block sm:mt-1">
                                    {tx.status}
                                </span>
                            </div>
                        </div>
                    ))}

                    {transactions.length === 0 && (
                        <div className="text-center py-20 bg-[#161b22]/20 border border-white/5 rounded-3xl">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-700" />
                            </div>
                            <p className="text-slate-500 font-medium">No transactions recorded.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
