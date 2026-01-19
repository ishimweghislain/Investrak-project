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
    const auth = await verifyAuth(request);
    if (!auth) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { type, amount, status, description, userId, date } = body;

        // Security check: Investors can only create transactions for themselves
        const targetUserId = auth.role === 'ADMIN' ? userId : auth.id;

        const transaction = await prisma.transaction.create({
            data: {
                type: type || 'PAYMENT',
                amount: parseFloat(amount),
                status: status || 'COMPLETED',
                description: description || `Payment via ${body.paymentMethod || 'Mock Gateway'}`,
                userId: targetUserId,
                date: date ? new Date(date) : new Date(),
            }
        });

        // 3. Investor Notifications & Payment Status Logic
        if (targetUserId && type === 'PAYMENT') {
            // Get user's investment to calculate monthly requirement
            const investment = await prisma.investment.findFirst({
                where: { userId: targetUserId, status: 'ACTIVE' }
            });

            if (investment) {
                const monthlyRequired = investment.amount / 60;
                let message = "";

                if (parseFloat(amount) >= monthlyRequired) {
                    message = "You are on good progress, continue.";
                } else {
                    message = "You are falling behind on your payment schedule.";
                }

                // Create notification for the investor
                await prisma.notification.create({
                    data: {
                        userId: targetUserId,
                        message: message,
                        isRead: false
                    }
                });
            }
        }

        // Also Log this action in Audit Logs
        await prisma.auditLog.create({
            data: {
                action: 'CREATE_TRANSACTION',
                details: `Created transaction of ${amount} for user ${targetUserId}`,
                userId: auth.id
            }
        });

        return NextResponse.json(transaction);
    } catch (error: any) {
        console.error('Error creating transaction:', error);
        return NextResponse.json({ message: 'Error creating transaction', error: error.message }, { status: 500 });
    }
}
