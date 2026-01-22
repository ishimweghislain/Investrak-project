import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const period = searchParams.get('period'); // 'week', 'month', 'year', 'all'

        let dateFilter: any = {};
        if (period === 'week') {
            const date = new Date();
            date.setDate(date.getDate() - 7);
            dateFilter = { createdAt: { gte: date } };
        } else if (period === 'month') {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            dateFilter = { createdAt: { gte: date } };
        } else if (period === 'year') {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 1);
            dateFilter = { createdAt: { gte: date } };
        }

        // Fetch Manual Reports
        let manualReports;
        let query: any = { ...dateFilter };
        if (user.role !== 'ADMIN') {
            query.userId = user.id;
        } else if (userId) {
            query.userId = userId;
        }

        manualReports = await prisma.report.findMany({
            where: query,
            include: { user: { select: { username: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // Convert Payment Transactions to "Reports"
        let txQuery: any = {
            type: 'PAYMENT',
            status: 'COMPLETED',
            ...(dateFilter.createdAt ? { date: dateFilter.createdAt } : {})
        };

        if (user.role !== 'ADMIN') {
            txQuery.userId = user.id;
        } else if (userId) {
            txQuery.userId = userId;
        }

        const payments = await prisma.transaction.findMany({
            where: txQuery,
            include: { user: { select: { username: true } } },
            orderBy: { date: 'desc' }
        });

        const paymentReports = payments.map((p: any) => ({
            id: p.id,
            title: `Payment Receipt: RWF ${p.amount.toLocaleString()}`,
            url: '#', // Receipts are generated client-side from transaction data
            type: 'RECEIPT',
            createdAt: p.date,
            user: p.user,
            userId: p.userId,
            amount: p.amount,
            description: p.description
        }));

        // Combine and Sort
        const allReports = [...manualReports, ...paymentReports].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json(allReports);
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
