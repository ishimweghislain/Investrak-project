'use client';

import { useEffect, useState } from 'react';
import { User, Wallet, FileText, ArrowRight, Shield, PieChart as PieIcon } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser(payload);
        } catch (e) {
            window.location.href = '/';
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className="min-h-screen p-4 md:p-10 pb-24 md:pb-10 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {/* Welcome Section */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold dark:text-white text-slate-900 mb-2 tracking-tight">
                        Hello, <span className="text-blue-600">{user?.firstName || user?.username}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        {isAdmin ? 'Welcome to your Admin Control Panel.' : 'Here is an overview of your investments.'}
                    </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {isAdmin && (
                        <Link href="/dashboard/overview"
                            className="group bg-blue-600 p-6 rounded-[24px] border border-blue-500 shadow-xl shadow-blue-600/20 hover:shadow-2xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                                <PieIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Strategic Overview
                            </h3>
                            <p className="text-blue-100 text-sm mb-4">
                                Deep analytics on partner commitments and payment progress.
                            </p>
                            <div className="flex items-center text-white font-bold text-sm">
                                View Analytics <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    )}

                    {/* Card 1 */}
                    <Link href={isAdmin ? "/dashboard/manage-investors" : "/dashboard/portfolio"}
                        className="group bg-white dark:bg-[#161b22] p-6 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            {isAdmin ? <User className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
                        </div>
                        <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">
                            {isAdmin ? 'Manage Investors' : 'My Portfolio'}
                        </h3>
                        <p className="text-slate-500 text-sm mb-4">
                            {isAdmin ? 'Add new investors and manage their funds.' : 'Check the value of your assets.'}
                        </p>
                        <div className="flex items-center text-blue-600 font-bold text-sm">
                            Open <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Card 2 */}
                    <Link href="/dashboard/reports"
                        className="group bg-white dark:bg-[#161b22] p-6 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-600/10 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">
                            Documents
                        </h3>
                        <p className="text-slate-500 text-sm mb-4">
                            {isAdmin ? 'Upload new reports for investors.' : 'Download your monthly reports.'}
                        </p>
                        <div className="flex items-center text-purple-600 font-bold text-sm">
                            View Docs <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Card 3 */}
                    {isAdmin && (
                        <Link href="/dashboard/content"
                            className="group bg-white dark:bg-[#161b22] p-6 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-600/10 rounded-xl flex items-center justify-center mb-4 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">
                                Manage Site Content
                            </h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Edit public facing pages.
                            </p>
                            <div className="flex items-center text-orange-600 dark:text-orange-400 font-bold text-sm">
                                Edit Content <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    )}

                    {isAdmin && (
                        <Link href="/dashboard/audit-logs"
                            className="group bg-white dark:bg-[#161b22] p-6 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700/30 rounded-xl flex items-center justify-center mb-4 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">
                                Audit Logs
                            </h3>
                            <p className="text-slate-500 text-sm mb-4">
                                See who did what and when.
                            </p>
                            <div className="flex items-center text-slate-600 dark:text-slate-400 font-bold text-sm">
                                Check Logs <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    )}

                    {!isAdmin && (
                        <Link href="/dashboard/investments"
                            className="group bg-white dark:bg-[#161b22] p-6 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-600/10 rounded-xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">
                                Active Investments
                            </h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Detailed view of your current active plans.
                            </p>
                            <div className="flex items-center text-green-600 font-bold text-sm">
                                View <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    )}
                </div>

                {/* Simple Info Banner */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-200">Need Help?</h4>
                        <p className="text-blue-700 dark:text-blue-400 text-sm">{isAdmin ? 'Contact the system developer.' : 'Contact your account manager for support.'}</p>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        Contact Support
                    </button>
                </div>

            </div>
        </div>
    );
}
