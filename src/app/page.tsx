
import { prisma } from '@/lib/prisma';
import LandingPageClient from '@/components/LandingPageClient';

export const revalidate = 0; // Disable static caching for dynamic content updates

export default async function LandingPage() {
    let settingsRaw = [];
    let services = [];
    let team = [];
    let testimonials = [];

    try {
        // parallel data fetching
        [settingsRaw, services, team, testimonials] = await Promise.all([
            (prisma as any).siteSetting.findMany(),
            (prisma as any).service.findMany({ orderBy: { createdAt: 'asc' } }),
            (prisma as any).teamMember.findMany({ orderBy: { createdAt: 'asc' } }),
            (prisma as any).testimonial.findMany({ orderBy: { createdAt: 'asc' } }),
        ]);
    } catch (error) {
        console.error("Database connection failed on LandingPage:", error);
        // Continue with empty data instead of crashing
    }


    // Convert settings to simple object
    const settings: Record<string, string> = {};
    settingsRaw.forEach((s: any) => {
        settings[s.key] = s.value;
    });

    return (
        <LandingPageClient
            settings={settings}
            services={services}
            team={team}
            testimonials={testimonials}
        />
    );
}
