import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const investmentId = searchParams.get('investmentId');

        let where: any = {};
        if (user.role === 'ADMIN') {
            if (userId) where.userId = userId;
        } else {
            where.userId = user.id;
        }
        if (investmentId) where.investmentId = investmentId;

        const transactions = await prisma.transaction.findMany({
            where,
            include: { user: { select: { username: true } } },
            orderBy: { date: 'desc' }
        });

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
        const { type, amount, status, description, userId, date, investmentId } = body;

        // Security check: Investors can only create transactions for themselves
        const targetUserId = auth.role === 'ADMIN' ? userId : auth.id;

        // Validation: If it's a payment, check if the investment is ACTIVE
        if (type === 'PAYMENT' && investmentId) {
            const checkInv = await prisma.investment.findUnique({
                where: { id: investmentId }
            });

            if (checkInv && checkInv.status === 'PENDING') {
                return NextResponse.json({
                    message: `Please wait for the investment "${checkInv.title}" to be activated before making payments.`
                }, { status: 400 });
            }
        }

        // Sanitize amount: remove commas if it's a string
        const sanitizedAmount = typeof amount === 'string' ? amount.replace(/,/g, '') : amount;
        const parsedAmount = parseFloat(sanitizedAmount);

        if (isNaN(parsedAmount)) {
            return NextResponse.json({ message: 'Invalid amount format' }, { status: 400 });
        }

        const transaction = await prisma.transaction.create({
            data: {
                type: type || 'PAYMENT',
                amount: parsedAmount,
                status: status || 'COMPLETED',
                description: description || `Payment via ${body.paymentMethod || 'Mock Gateway'}`,
                userId: targetUserId,
                investmentId: investmentId || null,
                date: date ? new Date(date) : new Date(),
            }
        });
        // 3. Investor Notifications & Payment Status Logic
        if (targetUserId && type === 'PAYMENT') {
            // Get specific investment or first active one to calculate monthly requirement
            let investment = null;
            if (investmentId) {
                investment = await prisma.investment.findUnique({ where: { id: investmentId } });
            } else {
                investment = await prisma.investment.findFirst({
                    where: { userId: targetUserId, status: 'ACTIVE' }
                });
            }

            if (investment) {
                const monthlyRequired = investment.amount / 60;
                let message = "";

                if (parseFloat(amount) >= monthlyRequired) {
                    message = `Payment received for ${investment.title}. You are on good progress, continue.`;
                } else {
                    message = `Payment of RWF ${parseFloat(amount).toLocaleString()} received for ${investment.title}. You are falling behind on your monthly goal of RWF ${monthlyRequired.toLocaleString()}.`;
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
                details: `Created transaction of ${amount} for user ${targetUserId}${investmentId ? ` (Inv: ${investmentId})` : ''}`,
                userId: auth.id
            }
        });

        return NextResponse.json(transaction);
    } catch (error: any) {
        console.error('CRITICAL: Transaction Creation Error Details:');
        console.error('- Message:', error.message);
        console.error('- Stack:', error.stack);
        console.error('- Body received:', await request.clone().json().catch(() => 'could not parse body'));

        return NextResponse.json({
            message: 'Error creating transaction',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
