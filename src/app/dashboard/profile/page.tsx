'use client';
import { useEffect, useState } from 'react';
import { Loader2, User, Settings, Shield, Bell, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setUser(JSON.parse(atob(token.split('.')[1])));
            } catch (e) { }
        }
        setLoading(false);
    }, []);

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
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Identity Profile</h1>

                <div className="bg-white dark:bg-[#161b22]/40 rounded-[32px] border border-slate-200 dark:border-white/5 p-8 mb-6 shadow-sm">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-slate-800 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-blue-900/20 text-white">
                            <span className="text-3xl font-bold">{user?.username?.[0]?.toUpperCase()}</span>
                        </div>
                        <h2 className="text-2xl font-bold">{user?.username}</h2>
                        <span className="text-blue-600 dark:text-blue-400 font-mono text-xs mt-1 bg-blue-100 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
                            {user?.role} NODE
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-[#0d1117] rounded-2xl border border-slate-200 dark:border-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800/50 rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Security Level</h4>
                                <p className="text-xs text-slate-500">Enterprise Encryption Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <button className="w-full p-4 bg-white hover:bg-slate-50 dark:bg-[#161b22]/40 dark:hover:bg-[#161b22] text-left rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-4 transition-colors group shadow-sm">
                        <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Notification Preferences</span>
                    </button>
                    <button className="w-full p-4 bg-white hover:bg-slate-50 dark:bg-[#161b22]/40 dark:hover:bg-[#161b22] text-left rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-4 transition-colors group shadow-sm">
                        <Settings className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Account Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
