'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, CreditCard } from "lucide-react";

interface StripeButtonProps {
    amount: number; // In RWF
    investmentId: string;
    description: string;
    onSuccess: () => void;
}

export default function StripeButton({ amount, investmentId, description, onSuccess }: StripeButtonProps) {
    const [loading, setLoading] = useState(false);

    const sanitizedAmount = amount.toString().replace(/,/g, '').trim();

    const handleStripePayment = async () => {
        const amountRwf = parseFloat(sanitizedAmount);

        if (amountRwf < 500) { // Practical minimum for RWF in Stripe (~$0.50 equivalent)
            toast.error(`Amount too small. Minimum is RWF 500.`);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/stripe/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: amountRwf, // Sending raw RWF now
                    description: description,
                    investmentId: investmentId,
                    origin: window.location.origin,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.url) {
                throw new Error(data.error || "Failed to create payment session");
            }

            // Store data needed for confirmation when user returns from Stripe
            localStorage.setItem('stripe_pending', JSON.stringify({
                sessionId: data.sessionId,
                amountRwf: sanitizedAmount,
                investmentId: investmentId,
                description: description,
            }));

            // Redirect to Stripe hosted checkout
            window.location.href = data.url;
        } catch (error: any) {
            toast.error(error.message || "Failed to start payment");
            setLoading(false);
        }
    };

    return (
        <div className="w-full mt-4 space-y-3">
            <button
                onClick={handleStripePayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-violet-600/20 transition-all text-base"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Connecting to Secure Payment Port...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        Pay Securely with Stripe
                    </>
                )}
            </button>

            <p className="text-[10px] text-slate-400 font-medium text-center italic">
                You will be redirected to Stripe&apos;s secure checkout page.
            </p>
        </div>
    );
}
