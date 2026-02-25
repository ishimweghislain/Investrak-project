import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { sessionId, amountRwf, investmentId, description } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
        }

        // ✅ IDEMPOTENCY CHECK — Prevent double recording
        const existing = await prisma.transaction.findFirst({
            where: {
                description: { contains: sessionId },
                userId: user.id,
            }
        });
        if (existing) {
            console.log(`Stripe session ${sessionId} already recorded. Skipping.`);
            return NextResponse.json({ alreadyProcessed: true });
        }

        // Verify stripe session is actually paid
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return NextResponse.json({ message: "Payment not completed", status: session.payment_status }, { status: 400 });
        }

        // Check if investment is active
        if (investmentId) {
            const checkInv = await prisma.investment.findUnique({ where: { id: investmentId } });
            if (checkInv && checkInv.status === 'PENDING') {
                return NextResponse.json({
                    message: `Please wait for the investment "${checkInv.title}" to be activated before making payments.`
                }, { status: 400 });
            }
        }

        const amountNum = parseFloat(amountRwf.toString().replace(/,/g, ''));

        // Record transaction in DB (include sessionId in description for idempotency lookup)
        await prisma.transaction.create({
            data: {
                type: "PAYMENT",
                amount: amountNum,
                status: "COMPLETED",
                description: `Stripe Payment (Session: ${sessionId})`,
                userId: user.id,
                investmentId: investmentId || null,
                date: new Date(),
            }
        });

        // Notify investor
        if (investmentId) {
            const investment = await prisma.investment.findUnique({ where: { id: investmentId } });
            await prisma.notification.create({
                data: {
                    userId: user.id,
                    message: `Stripe payment received: RWF ${amountNum.toLocaleString()} for ${investment?.title || 'your investment'}. Thank you!`,
                    isRead: false
                }
            });

            // Notify all admins
            const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
            for (const admin of admins) {
                await prisma.notification.create({
                    data: {
                        userId: admin.id,
                        message: `New Stripe Payment: ${user.username} paid RWF ${amountNum.toLocaleString()} for ${investment?.title || 'Investment'}.`,
                        isRead: false
                    }
                });
            }
        }

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'CREATE_TRANSACTION',
                details: `Stripe payment of ${amountNum} RWF for user ${user.id} (Inv: ${investmentId}, Session: ${sessionId})`,
                userId: user.id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Stripe Confirm Payment Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
