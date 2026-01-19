
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(await prisma.service.findMany({ orderBy: { createdAt: 'asc' } }));
}

export async function POST(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { title, description } = await req.json();
    const service = await prisma.service.create({ data: { title, description } });
    return NextResponse.json(service);
}

export async function PUT(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id, title, description } = await req.json();
    const service = await prisma.service.update({
        where: { id },
        data: { title, description }
    });
    return NextResponse.json(service);
}

export async function DELETE(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
