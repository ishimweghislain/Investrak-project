import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const logs = await prisma.auditLog.findMany({
            include: {
                user: { select: { username: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit to last 100 logs
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
