'use client';
import { useEffect, useState } from 'react';
import { Bell, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        fetch('/api/notifications', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNotifications(data);
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
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 tracking-tight">Intelligence Alerts</h1>
                <div className="space-y-4">
                    {notifications.map(n => (
                        <div key={n.id} className="bg-[#161b22]/60 backdrop-blur-xl p-5 rounded-2xl border border-white/5 flex gap-4 hover:bg-[#161b22] transition-colors">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.isRead ? 'bg-slate-800 text-slate-600' : 'bg-blue-600/10 text-blue-400'}`}>
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-white mb-1">System Notification</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">{n.message}</p>
                                <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase">{new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <div className="text-center py-20 bg-[#161b22]/20 border border-white/5 rounded-3xl">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-slate-700" />
                            </div>
                            <p className="text-slate-500 font-medium">All systems nominal. No new alerts.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
