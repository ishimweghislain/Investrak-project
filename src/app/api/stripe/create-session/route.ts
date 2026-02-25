import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { amount, description, investmentId, origin } = await request.json();

        // amount is in RWF (integer)
        // Stripe expects amount in lowest denomination. 
        // RWF is a 0-decimal currency, so 1 RWF = 1 unit.
        const amountInt = Math.round(parseFloat(amount));

        if (amountInt < 500) { // Stripe minimum for RWF
            return NextResponse.json({ error: "Amount too small. Minimum is 500 RWF." }, { status: 400 });
        }

        const siteUrl = origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'rwf',
                        product_data: {
                            name: description || 'Portfolio Investment Installment',
                        },
                        unit_amount: amountInt,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                investmentId: investmentId || '',
            },
            success_url: `${siteUrl}/dashboard/portfolio?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/dashboard/portfolio?stripe_status=cancel`,
        });

        console.log(`Stripe session created: ${session.id}`);
        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
        console.error("Stripe Create Session Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
