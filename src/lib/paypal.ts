const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "AWwod6PO6_rdzONzxn4ftKHQyp9aiCseRnBBSFxvapkbkd9NXBiOM3T1WEnrS98kiZdgpYSVNxXsvQd4";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "EMcS5JPhOCMcpmSu0xo1e8udMg0THxPXCoCrnyzHfg8eXxJqWOih2F8QRM2y6XPqvRb45hc5yn0GjdK5";
const base = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

export async function generateAccessToken() {
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

export async function createOrder(amount: string, origin?: string) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Ensure we have a valid absolute URL for returns
    const siteUrl = origin || process.env.NEXT_PUBLIC_APP_URL || "https://example.com";

    const body = JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
            {
                reference_id: `txn_${Date.now()}`,
                amount: {
                    currency_code: "USD",
                    value: formattedAmount,
                },
                description: "Portfolio Investment Installment"
            }
        ],
        application_context: {
            brand_name: "Investrak Spark Group",
            landing_page: "BILLING",
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
            return_url: `${siteUrl}/dashboard/portfolio?status=success`,
            cancel_url: `${siteUrl}/dashboard/portfolio?status=cancel`
        }
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "PayPal-Request-Id": `order_${Date.now()}`
        },
        body: body,
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("PayPal API Error Response:", data);
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
        console.error("PayPal Capture Error Response:", data);
    }
    return data;
}
