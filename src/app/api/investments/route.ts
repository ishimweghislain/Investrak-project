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
        // Auto-activate investments that have reached their start date
        // Use end of current day to ensure "Today" is always activated regardless of timezone/time
        const now = new Date();
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        const pendingInvestments = await prisma.investment.findMany({
            where: {
                status: 'PENDING',
                startDate: { lte: endOfToday }
            }
        });

        for (const inv of pendingInvestments) {
            await prisma.investment.update({
                where: { id: inv.id },
                data: { status: 'ACTIVE' }
            });

            // Notify investor
            await prisma.notification.create({
                data: {
                    userId: inv.userId,
                    message: `Welcome! Your investment "${inv.title}" has officially started. You can now begin your monthly installments.`,
                    isRead: false
                }
            });

            // Log
            await prisma.auditLog.create({
                data: {
                    action: 'INVESTMENT_ACTIVATED',
                    details: `Investment ${inv.id} auto-activated on start date`,
                    userId: inv.userId
                }
            });
        }

        // Simplified GET: Just return investments
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
        const { title, amount, userId, startDate, status, assetType } = body;

        const start = startDate ? new Date(startDate) : new Date();
        const maturity = new Date(start);
        maturity.setFullYear(maturity.getFullYear() + 5);

        // If status is PENDING but start date is today or past, make it ACTIVE
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        let finalStatus = status || 'PENDING';
        if (finalStatus === 'PENDING' && start <= endOfToday) {
            finalStatus = 'ACTIVE';
        }

        const investment = await prisma.investment.create({
            data: {
                title: title || "Strategic Cash Investment",
                amount: parseFloat(amount),
                userId,
                startDate: start,
                maturityDate: maturity,
                roi: 0,
                status: finalStatus,
                assetType: assetType || 'Development'
            }
        });

        // Notify investor about asset assignment
        await prisma.notification.create({
            data: {
                userId,
                message: `New asset assigned: "${investment.title}" of type ${investment.assetType}. Principal: RWF ${investment.amount.toLocaleString()}.`,
                isRead: false
            }
        });

        // Log
        await prisma.auditLog.create({
            data: {
                action: 'CREATE_INVESTMENT',
                details: `Created investment ${investment.title} for user ${userId}`,
                userId: user.id
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

        const start = body.startDate ? new Date(body.startDate) : undefined;
        let finalStatus = body.status;
        let autoActivated = false;

        // If updating to PENDING or it's already PENDING, and date is reached, move to ACTIVE
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        if (finalStatus === 'PENDING' && start && start <= endOfToday) {
            finalStatus = 'ACTIVE';
            autoActivated = true;
        }

        const updated = await prisma.investment.update({
            where: { id },
            data: {
                title: body.title,
                amount: body.amount ? parseFloat(body.amount) : undefined,
                roi: body.roi ? parseFloat(body.roi) : undefined,
                status: finalStatus,
                startDate: start,
                maturityDate: body.maturityDate ? new Date(body.maturityDate) : undefined,
                assetType: body.assetType
            }
        });

        if (autoActivated) {
            await prisma.notification.create({
                data: {
                    userId: updated.userId,
                    message: `Update: Your investment "${updated.title}" is now ACTIVE as the start date has been reached.`,
                    isRead: false
                }
            });
        }

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

        // Since we have Cascade delete in schema, deleting the investment
        // will automatically delete all linked transactions and returns.
        const deleted = await prisma.investment.delete({
            where: { id }
        });

        // Log the deletion
        await prisma.auditLog.create({
            data: {
                action: 'DELETE_INVESTMENT',
                details: `Deleted investment ${deleted.title} (${deleted.id}) for user ${deleted.userId}`,
                userId: user.id
            }
        });

        return NextResponse.json(deleted);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting', error: error.message }, { status: 500 });
    }
}
