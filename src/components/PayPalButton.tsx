'use client';

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface PayPalButtonProps {
    amount: number; // In RWF
    investmentId: string;
    description: string;
    onSuccess: () => void;
}

export default function PayPalButton({ amount, investmentId, description, onSuccess }: PayPalButtonProps) {
    const [{ isPending, isResolved, isRejected }, dispatch] = usePayPalScriptReducer();
    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setDebugLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 5));
    };

    useEffect(() => {
        addLog("PayPalButton Mounted");
    }, []);

    useEffect(() => {
        if (isPending) addLog("SDK: Loading...");
        if (isResolved) addLog("SDK: Ready ✅");
        if (isRejected) addLog("SDK: Failed ❌");
    }, [isPending, isResolved, isRejected]);

    const sanitizedAmount = amount.toString().replace(/,/g, '').trim();
    const usdAmount = (parseFloat(sanitizedAmount) / 1300).toFixed(2);

    const createOrder = async () => {
        try {
            addLog(`Order: Sending $${usdAmount} to API...`);
            const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: usdAmount }),
            });

            const order = await response.json();
            if (!response.ok) throw new Error(order.error || "Failed to create order");
            addLog(`Order ID: ${order.id}`);
            return order.id;
        } catch (error: any) {
            addLog(`ERROR: ${error.message}`);
            toast.error(error.message);
            throw error;
        }
    };

    const onApprove = async (data: any) => {
        addLog("Payment Approved, Capturing...");
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
                    amount: sanitizedAmount,
                    investmentId: investmentId,
                    description: description,
                }),
            });

            const details = await response.json();
            if (response.ok && (details.status === "COMPLETED" || details.status === "APPROVED")) {
                addLog("SUCCESS!");
                toast.success("Payment successful!");
                onSuccess();
            } else {
                addLog(`ERROR: ${details.message || 'Capture failed'}`);
                toast.error(details.message || "Payment failed to capture");
            }
        } catch (error: any) {
            toast.error("Error capturing payment");
        }
    };

    return (
        <div className="w-full mt-4 space-y-3">
            <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded-md">
                    PayPal Sandbox
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                    {usdAmount} USD
                </span>
            </div>

            <div className="relative min-h-[150px] flex flex-col justify-center">
                {isPending && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-white/5 rounded-2xl z-20">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent animate-spin rounded-full mb-2"></div>
                        <span className="text-[10px] text-slate-500 font-bold">Connecting to PayPal...</span>
                    </div>
                )}

                {isResolved && (
                    <div className="relative z-10 transition-all duration-500">
                        <PayPalButtons
                            style={{ layout: "vertical", shape: "rect", label: "pay" }}
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={(err) => addLog(`SDK ERROR: ${err}`)}
                        />
                    </div>
                )}

                {isRejected && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                        <p className="text-xs text-red-500 font-bold mb-2">PayPal failed to load</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-[10px] bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold"
                        >
                            RETRY PAGE
                        </button>
                    </div>
                )}
            </div>

            <div className="p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5">
                <div className="space-y-1">
                    {debugLogs.map((log, i) => (
                        <p key={i} className="text-[9px] font-mono text-slate-500 leading-tight">
                            {log}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
