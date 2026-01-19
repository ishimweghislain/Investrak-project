
// Dedicated Testimonials Page
import { prisma } from '@/lib/prisma';
import LandingPageClient from '@/components/LandingPageClient';
import { MessageSquare } from 'lucide-react';

export const revalidate = 0;

export default async function TestimonialsPage() {
    const testimonials = await (prisma as any).testimonial.findMany({ orderBy: { createdAt: 'desc' } });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200">
            {/* Navbar reuse or simple header */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <span className="font-bold text-xl">Testimonials</span>
                    <a href="/" className="text-sm font-medium hover:text-blue-600">Back to Home</a>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <MessageSquare className="w-3 h-3" /> Client Stories
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
                        What Our Partners Say
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Real feedback from the organizations and individuals we've helped grow.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.length > 0 ? testimonials.map((t: any) => (
                        <div key={t.id} className="bg-white dark:bg-[#161b22] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 hover:shadow-xl transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                {t.imageUrl ? <img src={t.imageUrl} className="w-14 h-14 rounded-full object-cover" /> : <div className="w-14 h-14 bg-slate-100 rounded-full"></div>}
                                <div>
                                    <h4 className="font-bold text-lg">{t.clientName}</h4>
                                    <span className="text-xs text-slate-500">Verified Client</span>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 italic text-lg leading-relaxed">"{t.description}"</p>
                        </div>
                    )) : (
                        <p className="text-center col-span-3">No testimonials found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
