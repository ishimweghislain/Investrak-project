import Link from 'next/link';
import { Home, PieChart, TrendingUp, FileText, User } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0c10] transition-colors duration-300">
                <Sidebar />
                <main className="flex-1 md:ml-64 relative">
                    {children}
                </main>
                <BottomNav />
            </div>
        </ThemeProvider>
    );
}
