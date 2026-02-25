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
    const [{ isPending }] = usePayPalScriptReducer();
    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setDebugLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 5));
    };

    useEffect(() => {
        addLog("PayPalButton Mounted");
    }, []);

    // Calculate USD (1 USD ≈ 1520 RWF — current market rate)
    const sanitizedAmount = amount.toString().replace(/,/g, '').trim();
    const usdAmount = (parseFloat(sanitizedAmount) / 1520).toFixed(2);

    const createOrder = async () => {
        try {
            if (parseFloat(usdAmount) < 0.01) {
                throw new Error("Amount is too small for PayPal (min $0.01 USD)");
            }

            addLog(`Order: Sending $${usdAmount} to API...`);
            const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: usdAmount,
                    origin: window.location.origin
                }),
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
            addLog(`CRITICAL: ${error.message}`);
            toast.error("Error capturing payment");
        }
    };

    return (
        <div className="w-full mt-4 space-y-3">
            <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded-md">
                    PayPal Sandbox Mode
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                    {usdAmount} USD
                </span>
            </div>

            <div className="relative min-h-[50px]">
                {isPending && (
                    <div className="w-full h-10 bg-slate-100 dark:bg-white/5 animate-pulse rounded-lg flex items-center justify-center">
                        <span className="text-[10px] text-slate-400 font-bold">Connecting to PayPal...</span>
                    </div>
                )}

                <div className={isPending ? 'hidden' : 'block'}>
                    <PayPalButtons
                        style={{ layout: "vertical", shape: "rect", label: "pay" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => addLog(`SDK ERROR: ${err}`)}
                    />
                </div>
            </div>

            {/* Test Status Monitor */}
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-black/5 pb-1">Test Status Monitor</p>
                <div className="space-y-1">
                    {debugLogs.length === 0 ? (
                        <p className="text-[10px] text-slate-500 italic">Starting up...</p>
                    ) : (
                        debugLogs.map((log, i) => (
                            <p key={i} className={`text-[9px] font-mono leading-tight ${log.includes('ERROR') ? 'text-red-500' : log.includes('SUCCESS') ? 'text-green-500' : 'text-slate-500'}`}>
                                {log}
                            </p>
                        ))
                    )}
                </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium text-center italic">
                Use your PayPal Sandbox test account only.
            </p>
        </div>
    );
}
