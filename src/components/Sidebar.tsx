'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, PieChart, TrendingUp, FileText, Shield, LogOut, Sun, Moon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@/components/ThemeProvider';

export default function Sidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setUser(JSON.parse(atob(token.split('.')[1])));
            } catch (e) { }
        }
    }, []);

    const navItems = user?.role === 'ADMIN' ? [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Manage Investors', href: '/dashboard/manage-investors', icon: Users },
        { name: 'Reports', href: '/dashboard/reports', icon: FileText },
        { name: 'Audit Logs', href: '/dashboard/audit-logs', icon: Shield },
    ] : [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Portfolio', href: '/dashboard/portfolio', icon: PieChart },
        { name: 'Investments', href: '/dashboard/investments', icon: TrendingUp },
        { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    ];

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    };

    return (
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
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm',
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-2">
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
    );
}
