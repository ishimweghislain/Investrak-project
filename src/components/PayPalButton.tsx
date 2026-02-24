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
        setDebugLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 10));
    };

    useEffect(() => {
        addLog("PayPalButton Component Mounted");
    }, []);

    useEffect(() => {

        if (isPending) {
            addLog("SDK Status: Loading...");
        } else {
            addLog("SDK Status: Ready");
        }
    }, [isPending]);


    const sanitizedAmount = amount.toString().replace(/,/g, '').trim();
    const usdAmount = (parseFloat(sanitizedAmount) / 1300).toFixed(2);

    const createOrder = async () => {
        try {
            addLog(`Step 1: Creating order for $${usdAmount} USD...`);
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
                addLog(`ERROR: Backend returned ${response.status}`);
                throw new Error(order.error || "Failed to create order");
            }

            addLog(`Step 2: Order ID received: ${order.id}`);
            return order.id;
        } catch (error: any) {
            addLog(`CRITICAL ERROR: ${error.message}`);
            toast.error(error.message || "Failed to create PayPal order");
            throw error;
        }
    };

    const onApprove = async (data: any) => {
        addLog(`Step 3: Payment Approved! Capturing ${data.orderID}...`);
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
                addLog(`Step 4: SUCCESS! Payment captured.`);
                toast.success("Payment successful!");
                onSuccess();
            } else {
                addLog(`ERROR: Capture failed: ${details.message}`);
                const errorMessage = details.message || "Payment failed to capture";
                toast.error(errorMessage);
            }
        } catch (error: any) {
            addLog(`CRITICAL ERROR: ${error.message}`);
            toast.error("Error capturing PayPal payment");
        }
    };

    return (
        <div className="w-full mt-4 space-y-3">
            <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    PayPal Sandbox Active
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                    Calculated: ${usdAmount} USD
                </span>
            </div>

            {isPending ? (
                <div className="h-10 bg-slate-100 dark:bg-white/5 animate-pulse rounded-lg flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 font-bold animate-pulse">Initializing PayPal...</span>
                </div>
            ) : (

                <div className="relative z-0">
                    <PayPalButtons
                        style={{ layout: "vertical", shape: "rect", label: "pay" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => {
                            addLog(`SDK ERROR: ${err.toString()}`);
                            toast.error("PayPal SDK Error occurred");
                        }}
                    />


                </div>
            )}

            {/* Debug Monitor for checking status on-screen */}
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-black/5 pb-1">Test Status Monitor</p>
                <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
                    {debugLogs.length === 0 ? (
                        <p className="text-[10px] text-slate-500 italic">No activity yet. Click the PayPal button above.</p>
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
