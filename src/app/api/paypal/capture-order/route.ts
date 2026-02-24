import { NextRequest, NextResponse } from "next/server";
import { capturePayment } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {

    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { orderID, amount, investmentId, description } = await request.json();

        // 1. Check if investment is active
        if (investmentId) {
            const checkInv = await prisma.investment.findUnique({
                where: { id: investmentId }
            });

            if (checkInv && checkInv.status === 'PENDING') {
                return NextResponse.json({
                    message: `Please wait for the investment "${checkInv.title}" to be activated before making payments.`
                }, { status: 400 });
            }
        }

        const captureData = await capturePayment(orderID);

        if (captureData.status === "COMPLETED") {
            // Record transaction in DB
            const amountNum = parseFloat(amount.toString());

            const transaction = await prisma.transaction.create({
                data: {
                    type: "PAYMENT",
                    amount: amountNum,
                    status: "COMPLETED",
                    description: description || `PayPal Payment (Order: ${orderID})`,
                    userId: user.id,
                    investmentId: investmentId || null,
                    date: new Date(),
                }
            });

            // Notifications logic (re-implemented from transactions route)
            if (investmentId) {
                const investment = await prisma.investment.findUnique({ where: { id: investmentId } });

                // Notify Investor
                await prisma.notification.create({
                    data: {
                        userId: user.id,
                        message: `Payment received: RWF ${amountNum.toLocaleString()} for ${investment?.title || 'your investment'}. Thank you!`,
                        isRead: false
                    }
                });

                // Notify all Admins
                const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
                for (const admin of admins) {
                    await prisma.notification.create({
                        data: {
                            userId: admin.id,
                            message: `New PayPal Payment: ${user.username} paid RWF ${amountNum.toLocaleString()} for ${investment?.title || 'Investment'}.`,
                            isRead: false
                        }
                    });
                }
            }

            // Log action
            await prisma.auditLog.create({
                data: {
                    action: 'CREATE_TRANSACTION',
                    details: `PayPal payment of ${amountNum} for user ${user.id} (Inv: ${investmentId})`,
                    userId: user.id
                }
            });

            return NextResponse.json(captureData);
        } else {
            return NextResponse.json({ message: "Payment not completed", details: captureData }, { status: 400 });
        }
    } catch (error: any) {
        console.error("PayPal Capture Order Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
