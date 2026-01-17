'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, TrendingUp, Menu, Sun, Moon, LogOut, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTheme } from '@/components/ThemeProvider';

export default function BottomNav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setUser(JSON.parse(atob(token.split('.')[1])));
            } catch (e) { }
        }
    }, []);

    const isAdmin = user?.role === 'ADMIN';

    const navItems = isAdmin ? [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Investors', href: '/dashboard/manage-investors', icon: TrendingUp },
        { name: 'Reports', href: '/dashboard/reports', icon: PieChart },
    ] : [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Portfolio', href: '/dashboard/portfolio', icon: PieChart },
        { name: 'Assets', href: '/dashboard/investments', icon: TrendingUp },
    ];

    const handleLogout = () => {
        if (confirm('Logout?')) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-[50] bg-white dark:bg-[#161b22] border-t border-slate-200 dark:border-white/10 pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                                    isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                )}
                            >
                                <item.icon className={clsx('w-5 h-5', isActive && 'stroke-[2.5px]')} />
                                <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={clsx(
                            'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-slate-300',
                            isMenuOpen && 'text-blue-600'
                        )}
                    >
                        <Menu className="w-5 h-5" />
                        <span className="text-[10px] font-bold tracking-wide">Menu</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Modal */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#0d1117] rounded-t-[32px] p-6 pb-24 animate-in slide-in-from-bottom border-t border-slate-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold dark:text-white text-slate-900">Menu</h3>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <button onClick={toggleTheme} className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold dark:text-white text-slate-900">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</p>
                                    <p className="text-xs text-slate-500">Switch appearance</p>
                                </div>
                            </button>

                            <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-red-600 dark:text-red-400">Logout</p>
                                    <p className="text-xs text-red-400">End session</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
