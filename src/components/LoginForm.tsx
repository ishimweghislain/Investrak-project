'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                toast.success('Access Granted');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                toast.error(data.message || 'Login failed');
                setLoading(false);
            }
        } catch (e) {
            toast.error('Network error');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-6">
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full mt-1 p-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500 transition-colors"
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full mt-1 p-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500 transition-colors"
                        placeholder="••••••••"
                    />
                </div>
                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                    {loading ? 'Checking...' : 'Login to Dashboard'}
                </button>
            </div>
        </form>
    );
}
