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

    // Convert RWF to USD — 1 USD ≈ 1520 RWF (current market rate)
    const RWF_TO_USD = 1520;
    const sanitizedAmount = amount.toString().replace(/,/g, '').trim();
    const usdAmount = (parseFloat(sanitizedAmount) / RWF_TO_USD).toFixed(2);

    const handleStripePayment = async () => {
        if (parseFloat(usdAmount) < 0.50) {
            toast.error(`Amount too small. Minimum is ~RWF 650 (USD $0.50). You entered $${usdAmount}.`);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/stripe/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: usdAmount,
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
            <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-violet-500 uppercase tracking-widest bg-violet-500/10 px-2 py-1 rounded-md">
                    Stripe Test Mode
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                    {usdAmount} USD
                </span>
            </div>

            <button
                onClick={handleStripePayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-violet-600/20 transition-all text-base"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecting to Stripe...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        Pay with Stripe
                    </>
                )}
            </button>

            <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Test Card Details</p>
                <p className="text-[10px] font-mono text-slate-500">Card: <span className="text-slate-300">4242 4242 4242 4242</span></p>
                <p className="text-[10px] font-mono text-slate-500">Expiry: <span className="text-slate-300">Any future date</span> · CVC: <span className="text-slate-300">Any 3 digits</span></p>
            </div>

            <p className="text-[10px] text-slate-400 font-medium text-center italic">
                You will be redirected to Stripe&apos;s secure checkout page.
            </p>
        </div>
    );
}
