
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        // DEV RULE: Only allow the specific email for now
        const DEV_EMAIL = "ishimweghislain82@gmail.com";
        if (email !== DEV_EMAIL) {
            return NextResponse.json({ message: "Development Restriction: Please use the authorized development email address." }, { status: 400 });
        }

        // Generate 5-digit code
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        const id = Math.random().toString(36).substring(7);

        // Bypass Prisma Model validation using Raw SQL (Solves EPERM/Generate lock issues)
        await prisma.$executeRawUnsafe(
            `DELETE FROM "verification_codes" WHERE "email" = $1`,
            email
        );

        await prisma.$executeRawUnsafe(
            `INSERT INTO "verification_codes" ("id", "email", "code", "expiresAt", "createdAt") VALUES ($1, $2, $3, $4, NOW())`,
            id, email, code, expiresAt
        );

        // Log for terminal visibility
        console.log(`[AUTH] OTP for ${email}: ${code} (Expires in 5 mins)`);

        // In a real system, we'd NOT return the code. 
        // But for development and user convenience as requested (make it work hosted/local), 
        // we'll return it so the UI can show it if needed or just for easy testing.
        return NextResponse.json({
            success: true,
            message: "A verification code has been generated and sent (Check terminal/logs).",
            debugCode: code // Returning for easy testing as requested
        });

    } catch (e: any) {
        console.error('OTP SEND ERROR:', e);
        return NextResponse.json({
            message: "Failed to send verification code",
            error: e.message
        }, { status: 500 });
    }
}
