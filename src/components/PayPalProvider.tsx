'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalProvider({ children }: { children: React.ReactNode }) {
    // Hardcoding for guaranteed connection
    const clientId = "AWwod6PO6_rdzONzxn4ftKHQyp9aiCseRnBBSFxvapkbkd9NXBiOM3T1WEnrS98kiZdgpYSVNxXsvQd4";

    return (
        <PayPalScriptProvider options={{
            clientId: clientId,
            currency: "USD",
            intent: "capture",
            "enable-funding": "card", // Enable optional funding sources for testing
            "disable-funding": "paylater", // Disable clutter
        }}>
            {children}
        </PayPalScriptProvider>
    );
}
