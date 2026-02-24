const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const base = "https://api-m.sandbox.paypal.com";

export async function generateAccessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("PayPal Client ID or Secret is missing in Server Env");
    }

    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`PayPal Auth failed: ${error.error_description || response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function createOrder(amount: string) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    // Ensure amount is exactly 2 decimal places and a string
    const formattedAmount = parseFloat(amount).toFixed(2);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: formattedAmount,
                    }
                }
            ]
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("PayPal Order Error:", data);
    }
    return data;
}

export async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("PayPal Capture Error:", data);
    }
    return data;
}
