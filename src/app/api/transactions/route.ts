import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        let transactions;
        if (user.role === 'ADMIN') {
            const { searchParams } = new URL(request.url);
            const userId = searchParams.get('userId');

            if (userId) {
                transactions = await prisma.transaction.findMany({
                    where: { userId },
                    include: { user: { select: { username: true } } },
                    orderBy: { date: 'desc' }
                });
            } else {
                transactions = await prisma.transaction.findMany({
                    include: { user: { select: { username: true } } },
                    orderBy: { date: 'desc' }
                });
            }
        } else {
            // Investor sees only their own
            transactions = await prisma.transaction.findMany({
                where: { userId: user.id },
                orderBy: { date: 'desc' }
            });
        }

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
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
        const { type, amount, status, description, userId, date } = body;

        const transaction = await prisma.transaction.create({
            data: {
                type,
                amount: parseFloat(amount),
                status: status || 'COMPLETED',
                description,
                userId,
                date: date ? new Date(date) : new Date(),
            }
        });

        // Also Log this action in Audit Logs (Simple implementation)
        await prisma.auditLog.create({
            data: {
                action: 'CREATE_TRANSACTION',
                details: `Created transaction of ${amount} for user ${userId}`,
                userId: user.id
            }
        });

        return NextResponse.json(transaction);
    } catch (error: any) {
        console.error('Error creating transaction:', error);
        return NextResponse.json({ message: 'Error creating transaction', error: error.message }, { status: 500 });
    }
}
