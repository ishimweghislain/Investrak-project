import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        let investments;
        if (user.role === 'ADMIN') {
            const { searchParams } = new URL(request.url);
            const userId = searchParams.get('userId');

            if (userId) {
                investments = await prisma.investment.findMany({
                    where: { userId },
                    include: { user: { select: { username: true, firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' }
                });
            } else {
                investments = await prisma.investment.findMany({
                    include: { user: { select: { username: true, firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' }
                });
            }
        } else {
            // Investor sees only their own
            investments = await prisma.investment.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json(investments);
    } catch (error) {
        console.error('Failed to fetch investments:', error);
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
        const { title, amount, userId, startDate, maturityDate, roi, status } = body;

        const investment = await prisma.investment.create({
            data: {
                title,
                amount: parseFloat(amount),
                userId,
                startDate: startDate ? new Date(startDate) : undefined,
                maturityDate: maturityDate ? new Date(maturityDate) : undefined,
                roi: roi ? parseFloat(roi) : undefined,
                status: status || 'PENDING'
            }
        });

        return NextResponse.json(investment);
    } catch (error: any) {
        console.error('Error creating investment:', error);
        return NextResponse.json({ message: 'Error creating investment', error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();

        if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

        const updated = await prisma.investment.update({
            where: { id },
            data: {
                title: body.title,
                amount: body.amount ? parseFloat(body.amount) : undefined,
                roi: body.roi ? parseFloat(body.roi) : undefined,
                status: body.status,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                maturityDate: body.maturityDate ? new Date(body.maturityDate) : undefined,
            }
        });

        // Log
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE_INVESTMENT',
                details: `Updated investment ${updated.title} (${updated.status})`,
                userId: user.id
            }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating', error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

        const deleted = await prisma.investment.delete({
            where: { id }
        });

        return NextResponse.json(deleted);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting', error: error.message }, { status: 500 });
    }
}
