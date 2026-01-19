
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch all investors and their investments/transactions
        const investors = await prisma.user.findMany({
            where: { role: 'INVESTOR' },
            select: {
                id: true,
                username: true,
                profileImage: true,
                investments: {
                    select: {
                        amount: true,
                        status: true
                    }
                },
                transactions: {
                    where: { type: 'PAYMENT', status: 'COMPLETED' },
                    select: {
                        amount: true
                    }
                }
            }
        });

        const progressData = investors.map(user => {
            const totalInvestment = user.investments.reduce((sum, inv) => sum + inv.amount, 0);
            const totalPaid = user.transactions.reduce((sum, tx) => sum + tx.amount, 0);

            const percentage = totalInvestment > 0
                ? Math.min(Math.round((totalPaid / totalInvestment) * 100 * 10) / 10, 100)
                : 0;

            return {
                id: user.id,
                username: user.username,
                profileImage: user.profileImage,
                progress: percentage,
                isCurrentUser: user.id === auth.id
            };
        });

        // Ensure we only return progress data, no sensitive details
        return NextResponse.json(progressData);
    } catch (error) {
        console.error('Progress API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
