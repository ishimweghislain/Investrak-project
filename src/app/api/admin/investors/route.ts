import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: List all investors
export async function GET(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const investors = await prisma.user.findMany({
            where: { role: 'INVESTOR' },
            select: {
                id: true,
                username: true,
                email: true,
                company: true,
                role: true,
                profileImage: true,
                createdAt: true,
                _count: {
                    select: { investments: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(investors);
    } catch (e: any) {
        console.error('API Error:', e);
        return NextResponse.json({ message: 'Failed to fetch investors' }, { status: 500 });
    }
}

// POST: Create Investor
export async function POST(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { username, password, email, company } = body;

        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        const newInvestor = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                company,
                profileImage: body.profileImage || null,
                role: 'INVESTOR'
            },
            include: {
                _count: {
                    select: { investments: true }
                }
            }
        });

        try {
            await prisma.auditLog.create({
                data: {
                    action: 'CREATE_INVESTOR',
                    details: `Created investor ${username}`,
                    userId: auth.id
                }
            });
        } catch (logErr) { console.log('Audit log failed', logErr); }

        return NextResponse.json(newInvestor);
    } catch (e: any) {
        console.error('Create Investor Error:', e);
        if (e.code === 'P2002') {
            const field = e.meta?.target?.[0] || 'field';
            return NextResponse.json({ message: `This ${field} is already taken. Please use another one.` }, { status: 400 });
        }
        return NextResponse.json({ message: 'Failed to create investor' }, { status: 500 });
    }
}

// PUT: Update Investor
export async function PUT(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, username, email, company, password, profileImage } = body;

        const dataToUpdate: any = { username, email, company, profileImage };

        if (password) {
            const bcrypt = await import('bcryptjs');
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const updated = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
            include: {
                _count: {
                    select: { investments: true }
                }
            }
        });

        try {
            await prisma.auditLog.create({
                data: {
                    action: 'UPDATE_INVESTOR',
                    details: `Updated investor ${username}`,
                    userId: auth.id
                }
            });
        } catch (logErr) { }

        return NextResponse.json(updated);
    } catch (e: any) {
        console.error('Update Investor Error:', e);
        if (e.code === 'P2002') {
            const field = e.meta?.target?.[0] || 'field';
            return NextResponse.json({ message: `This ${field} is already taken. Please use another one.` }, { status: 400 });
        }
        return NextResponse.json({ message: 'Failed to update' }, { status: 500 });
    }
}

// DELETE: Remove Investor
export async function DELETE(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

        // Manually handle "Cascading" deletions to avoid foreign key constraints
        // Delete returns -> investments -> transactions -> reports -> notifications -> auditLogs -> user

        // 1. Get all investments to delete their returns
        const investments = await prisma.investment.findMany({ where: { userId: id } });
        const investmentIds = investments.map(inv => inv.id);

        await prisma.return.deleteMany({ where: { investmentId: { in: investmentIds } } });
        await prisma.investment.deleteMany({ where: { userId: id } });
        await prisma.transaction.deleteMany({ where: { userId: id } });
        await prisma.report.deleteMany({ where: { userId: id } });
        await prisma.notification.deleteMany({ where: { userId: id } });
        await prisma.auditLog.deleteMany({ where: { userId: id } });

        await prisma.user.delete({ where: { id } });

        try {
            await prisma.auditLog.create({
                data: {
                    action: 'DELETE_INVESTOR',
                    details: `Deleted investor ID ${id}`,
                    userId: auth.id
                }
            });
        } catch (logErr) { }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
    }
}
