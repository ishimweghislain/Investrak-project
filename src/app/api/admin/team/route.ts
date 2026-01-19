
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(await prisma.teamMember.findMany({ orderBy: { createdAt: 'asc' } }));
}

export async function POST(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const member = await prisma.teamMember.create({ data: body });
    return NextResponse.json(member);
}

export async function PUT(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id, ...data } = await req.json();
    const member = await prisma.teamMember.update({
        where: { id },
        data
    });
    return NextResponse.json(member);
}

export async function DELETE(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
