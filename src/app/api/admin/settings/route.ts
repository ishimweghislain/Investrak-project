
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const settings = await prisma.siteSetting.findMany();
        const settingsMap: Record<string, string> = {};
        settings.forEach((s: any) => {
            settingsMap[s.key] = s.value;
        });
        return NextResponse.json(settingsMap);
    } catch (e) {
        return NextResponse.json({ message: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const updates = Object.entries(body).map(([key, value]) => {
            return prisma.siteSetting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        });

        await prisma.$transaction(updates);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to save settings' }, { status: 500 });
    }
}
