'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, PieChart, TrendingUp, FileText, Shield, LogOut, Sun, Moon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@/components/ThemeProvider';

import Image from 'next/image';

export default function Sidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const { theme, toggleTheme } = useTheme();

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setUser(JSON.parse(atob(token.split('.')[1])));
            } catch (e) { }
        }
    }, []);

    useEffect(() => {
        const fetchInquiryCount = async () => {
            if (user?.role === 'ADMIN') {
                try {
                    const res = await fetch('/api/contact');
                    if (res.ok) {
                        const messages = await res.json();
                        const unread = messages.filter((m: any) => !m.isRead).length;
                        setUnreadCount(unread);
                    }
                } catch (e) { }
            }
        };

        fetchInquiryCount();
        const interval = setInterval(fetchInquiryCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [user]);

    const navItems = user?.role === 'ADMIN' ? [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Manage Investors', href: '/dashboard/manage-investors', icon: Users },
        { name: 'Website Content', href: '/dashboard/content', icon: Search, count: unreadCount },
        { name: 'Reports', href: '/dashboard/reports', icon: FileText },
        { name: 'Audit Logs', href: '/dashboard/audit-logs', icon: Shield },
    ] : [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Portfolio', href: '/dashboard/portfolio', icon: PieChart },
        { name: 'Investments', href: '/dashboard/investments', icon: TrendingUp },
        { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    ];

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <>
            <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0d1117] dark:bg-[#0d1117] bg-white border-r border-slate-200 dark:border-white/10 z-40">
                <div className="p-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold dark:text-white text-slate-900 tracking-tighter">Investrak</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group relative',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="flex-1">{item.name}</span>
                                {item.count !== undefined && item.count > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-2">
                    {/* User Profile */}
                    {user && (
                        <div className="flex items-center gap-3 px-2 py-2 mb-2">
                            {user.profileImage ? (
                                <Image src={user.profileImage} alt={user.username} width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10" unoptimized />
                            ) : (
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.username}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{user.role?.toLowerCase()}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-sm font-medium"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-sm font-bold"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Logout Modal */}
            {isLoggingOut && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLoggingOut(false)}></div>
                    <div className="relative bg-white dark:bg-[#161b22] w-full max-w-sm rounded-[24px] p-8 text-center shadow-2xl border border-slate-200 dark:border-white/10">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sign Out?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Are you sure you want to end your session?</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setIsLoggingOut(false)} className="py-3 px-4 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                Cancel
                            </button>
                            <button onClick={confirmLogout} className="py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
