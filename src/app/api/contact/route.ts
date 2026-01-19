
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!(prisma as any).contactMessage) {
            console.error('Prisma Error: contactMessage model not found in client. Please restart the dev server and run npx prisma generate.');
            return NextResponse.json({ error: 'System not ready. Please restart the server.' }, { status: 500 });
        }

        const newMessage = await (prisma as any).contactMessage.create({
            data: {
                name,
                phone,
                email,
                message
            }
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('Contact error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const messages = await (prisma as any).contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, isRead } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const updated = await (prisma as any).contactMessage.update({
            where: { id },
            data: { isRead }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}
