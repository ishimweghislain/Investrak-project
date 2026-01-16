import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper to check if user is admin
async function isAdmin(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

    const token = authHeader.split(' ')[1];
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.role === 'ADMIN';
    } catch {
        return false;
    }
}

export async function GET(request: NextRequest) {
    if (!(await isAdmin(request))) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const investors = await prisma.user.findMany({
            where: { role: 'INVESTOR' as any },
            select: {
                id: true,
                username: true,
                email: true,
                company: true,
                firstName: true,
                lastName: true,
                createdAt: true,
            } as any
        });
        return NextResponse.json(investors);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching investors', error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!(await isAdmin(request))) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { username, company, password, email } = await request.json();

        if (!username || !password || !company) {
            return NextResponse.json({ message: 'Username, company, and password are required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email: email || `${username}@investrak-investor.com` }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({ message: 'Username or email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                company,
                password: hashedPassword,
                email: email || `${username}@investrak-investor.com`,
                role: 'INVESTOR' as any,
            } as any
        });

        return NextResponse.json({
            message: 'Investor created successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                company: (newUser as any).company,
                role: (newUser as any).role,
            }
        });
    } catch (error: any) {
        console.error('Error creating investor:', error);
        return NextResponse.json({ message: 'Error creating investor', error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    if (!(await isAdmin(request))) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const { username, company, email, password } = await request.json();

        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const updateData: any = {
            username,
            company,
            email,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            message: 'Investor updated successfully',
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                company: (updatedUser as any).company,
                role: updatedUser.role,
            }
        });
    } catch (error: any) {
        console.error('Error updating investor:', error);
        return NextResponse.json({ message: 'Error updating investor', error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    if (!(await isAdmin(request))) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Investor deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting investor:', error);
        return NextResponse.json({ message: 'Error deleting investor', error: error.message }, { status: 500 });
    }
}

