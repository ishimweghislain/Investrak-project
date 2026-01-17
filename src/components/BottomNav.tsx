'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, TrendingUp, FileText, User } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Portfolio', href: '/dashboard/portfolio', icon: PieChart },
        { name: 'Investments', href: '/dashboard/investments', icon: TrendingUp },
        { name: 'Ledger', href: '/dashboard/transactions', icon: FileText },
        { name: 'Reports', href: '/dashboard/reports', icon: FileText },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#161b22] border-t border-white/10 pb-[env(safe-area-inset-bottom)] md:hidden shadow-2xl">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                                isActive ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
                            )}
                        >
                            <item.icon className={clsx('w-5 h-5', isActive && 'stroke-[2.5px]')} />
                            <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
