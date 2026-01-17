import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        let reports;
        if (user.role === 'ADMIN') {
            const { searchParams } = new URL(request.url);
            const userId = searchParams.get('userId');

            if (userId) {
                reports = await prisma.report.findMany({
                    where: { userId },
                    orderBy: { createdAt: 'desc' }
                });
            } else {
                reports = await prisma.report.findMany({
                    include: { user: { select: { username: true } } },
                    orderBy: { createdAt: 'desc' }
                });
            }
        } else {
            reports = await prisma.report.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json(reports);
    } catch (error) {
        console.error('Failed to fetch reports:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { title, url, type, userId } = body;

        const report = await prisma.report.create({
            data: {
                title,
                url,
                type,
                userId
            }
        });

        // Log
        await prisma.auditLog.create({
            data: {
                action: 'UPLOAD_REPORT',
                details: `Uploaded report ${title} for user ${userId}`,
                userId: user.id
            }
        });

        return NextResponse.json(report);
    } catch (error: any) {
        console.error('Error creating report:', error);
        return NextResponse.json({ message: 'Error creating report', error: error.message }, { status: 500 });
    }
}
