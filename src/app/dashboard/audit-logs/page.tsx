'use client';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft, Shield, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        fetch('/api/admin/audit-logs', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (res.status === 403) {
                    router.push('/dashboard');
                    throw new Error('Unauthorized');
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setLogs(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
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
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Audit Logs</h1>
                        <p className="text-slate-500 text-sm">Security & Action Traceability</p>
                    </div>
                </div>

                <div className="bg-[#161b22]/40 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#0d1117] text-slate-400 uppercase font-bold text-xs tracking-wider">
                                <tr>
                                    <th className="p-4 border-b border-white/5">Timestamp</th>
                                    <th className="p-4 border-b border-white/5">User</th>
                                    <th className="p-4 border-b border-white/5">Action</th>
                                    <th className="p-4 border-b border-white/5">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 whitespace-nowrap font-mono text-slate-500">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-4 font-bold text-white">
                                            {log.user?.username || 'System'}
                                        </td>
                                        <td className="p-4 text-blue-400 font-bold uppercase text-xs">
                                            {log.action}
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            {log.details}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {logs.length === 0 && (
                        <div className="p-10 text-center text-slate-500">
                            No audit logs found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
