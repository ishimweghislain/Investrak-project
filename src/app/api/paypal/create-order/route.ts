import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/paypal";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { amount, origin } = await request.json();
        console.log(`Creating PayPal order for: $${amount} USD from ${origin}`);

        const order = await createOrder(amount, origin);

        if (order.error || order.message) {
            console.error("PayPal API Error:", order);
            return NextResponse.json({ error: order.message || "Failed to create order" }, { status: 400 });
        }

        console.log(`Order created successfully: ${order.id}`);
        return NextResponse.json(order);
    } catch (error: any) {
        console.error("PayPal Create Order Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
