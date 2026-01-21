
'use client';
import { useEffect, useState } from 'react';
import { Bell, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
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

        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setNotifications(data);

                    // Mark all as read after 2 seconds
                    if (data.some((n: any) => !n.isRead)) {
                        setTimeout(() => markAllAsRead(), 2000);
                    }
                }
            } catch (e) {
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [router]);

    const markAllAsRead = async () => {
        const token = localStorage.getItem('token');
        try {
            await fetch('/api/notifications/mark-read', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Opimistic UI update
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (e) { }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] flex items-center justify-center transition-colors">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-white p-6 pb-24 md:pb-10 transition-colors">
            <div className="max-w-3xl mx-auto">
                <header className="flex justify-between items-center mb-10 pt-4">
                    <div>
                        <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
                            <ArrowLeft className="w-3.5 h-3.5" /> Return
                        </button>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Intelligence Alerts</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Real-time status updates and activity logs</p>
                    </div>
                </header>

                <div className="space-y-4">
                    {notifications.map(n => (
                        <div key={n.id} className={`p-6 rounded-[24px] border transition-all flex gap-5 ${n.isRead
                                ? 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-80'
                                : 'bg-white dark:bg-[#161b22] border-blue-500/20 dark:border-blue-500/20 shadow-xl shadow-blue-500/5'
                            }`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${n.isRead
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                                    : 'bg-blue-600 text-white dark:bg-blue-500 shadow-lg shadow-blue-600/20'
                                }`}>
                                <Bell className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-bold text-sm ${n.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                        System Notification
                                    </h4>
                                    {!n.isRead && (
                                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                    )}
                                </div>
                                <p className={`text-sm leading-relaxed ${n.isRead ? 'text-slate-500 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {n.message}
                                </p>
                                <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {notifications.length === 0 && (
                        <div className="text-center py-32 bg-white/50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-[32px]">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-800" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-slate-400 text-slate-900 mb-2">All Clear</h3>
                            <p className="text-slate-500 font-medium text-sm">No new intelligence alerts to report.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
