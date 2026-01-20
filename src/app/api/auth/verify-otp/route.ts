
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ message: "Email and code are required." }, { status: 400 });
        }

        // Use Raw SQL to find valid code
        const results: any[] = await prisma.$queryRawUnsafe(
            `SELECT * FROM "verification_codes" WHERE "email" = $1 AND "code" = $2 AND "expiresAt" >= NOW() ORDER BY "createdAt" DESC LIMIT 1`,
            email, code
        );

        const record = results[0];

        if (!record) {
            return NextResponse.json({ message: "Invalid or expired verification code." }, { status: 400 });
        }

        // Single-use: Delete the code
        await prisma.$executeRawUnsafe(
            `DELETE FROM "verification_codes" WHERE "id" = $1`,
            record.id
        );

        return NextResponse.json({
            success: true,
            message: "Email ownership verified successfully."
        });

    } catch (e: any) {
        console.error('OTP VERIFY ERROR:', e);
        return NextResponse.json({
            message: "Verification failed",
            error: e.message
        }, { status: 500 });
    }
}
