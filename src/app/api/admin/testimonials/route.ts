
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }));
}

export async function POST(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const item = await prisma.testimonial.create({ data: body });
    return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id, ...data } = await req.json();
    const item = await prisma.testimonial.update({
        where: { id },
        data
    });
    return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
