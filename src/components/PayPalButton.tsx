'use client';

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

interface PayPalButtonProps {
    amount: number; // In RWF
    investmentId: string;
    description: string;
    onSuccess: () => void;
}

export default function PayPalButton({ amount, investmentId, description, onSuccess }: PayPalButtonProps) {
    const [{ isPending }] = usePayPalScriptReducer();

    // RWF to USD conversion (approximate rate: 1 USD = 1300 RWF)
    // First, remove any commas or spaces from the amount if it's a string
    const sanitizedAmount = amount.toString().replace(/,/g, '').trim();
    const usdAmount = (parseFloat(sanitizedAmount) / 1300).toFixed(2);

    const createOrder = async () => {
        try {
            console.log(`Creating order for RWF ${sanitizedAmount} -> USD ${usdAmount}`);
            const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: usdAmount,
                }),
            });

            const order = await response.json();
            if (!response.ok) {
                throw new Error(order.error || "Failed to create order");
            }
            return order.id;
        } catch (error: any) {
            console.error("Create Order Error:", error);
            toast.error(error.message || "Failed to create PayPal order");
            throw error;
        }
    };

    const onApprove = async (data: any) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                    amount: sanitizedAmount, // Send sanitized RWF amount to save in DB
                    investmentId: investmentId,
                    description: description,
                }),
            });

            const details = await response.json();
            if (response.ok && (details.status === "COMPLETED" || details.status === "APPROVED")) {
                toast.success("Payment successful!");
                onSuccess();
            } else {
                console.error("PayPal Capture Error Detail:", details);
                const errorMessage = details.message || (details.details && details.details[0]?.description) || "Payment failed to capture";
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Capture Error:", error);
            toast.error("Error capturing PayPal payment");
        }
    };

    return (
        <div className="w-full mt-4 space-y-3">
            <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    PayPal Sandbox Mode
                </span>
                <a
                    href="https://developer.paypal.com/dashboard/accounts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-blue-500 hover:underline"
                >
                    Get Test Accounts →
                </a>
            </div>

            {isPending ? (
                <div className="h-10 bg-slate-100 dark:bg-white/5 animate-pulse rounded-lg"></div>
            ) : (
                <div className="relative z-0">
                    {!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && (
                        <div className="p-2 mb-2 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-500 font-bold">
                            ⚠️ ERROR: Client ID not found. Restart your terminal (npm run dev)!
                        </div>
                    )}
                    <PayPalButtons
                        style={{ layout: "vertical", shape: "rect", label: "pay" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                    />
                </div>
            )}

            <p className="text-[10px] text-slate-400 font-medium text-center">
                Use your PayPal Developer sandbox account to test. No real money will be charged.
            </p>
        </div>
    );
}
