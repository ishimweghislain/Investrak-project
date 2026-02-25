# 🚀 Production Migration Guide: PayPal & Stripe

This guide outlines the steps required to transition your payment systems from **Sandbox/Test Mode** to **Live/Production Mode**.

---

## 💳 Stripe: Going Live

### 1. Activate your Stripe Account
- Log in to your [Stripe Dashboard](https://dashboard.stripe.com/).
- Follow the prompt to **"Activate your account"**.
- You will need to provide your business/personal legal name, address, and bank account details for payouts.
- *Note: If providing services in Rwanda, you may need a bank account in a supported country (Stripe currently supports 40+ countries).*

### 2. Obtain Live API Keys
- Once activated, toggle the **"Test Mode"** switch at the top right to **OFF**.
- Navigate to **Developers -> API Keys**.
- Copy your **Live Publishable Key** (`pk_live_...`) and **Live Secret Key** (`sk_live_...`).

### 3. Update Environment Variables
Update your hosting platform (Vercel) and local `.env` files:

```env
# STRIPE LIVE KEYS
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
```

---

## 🅿️ PayPal: Going Live

### 1. Create a PayPal Business Account
- Ensure you have a [PayPal Business Account](https://www.paypal.com/bizsignup/).
- Log in to the [PayPal Developer Portal](https://developer.paypal.com/).

### 2. Create a Live App
- Go to the **Dashboard -> My Apps & Credentials**.
- Switch the toggle from **Sandbox** to **Live**.
- Click **Create App**.
- Name it (e.g., "Investrak Production").
- Copy your **Live Client ID** and **Live Secret**.

### 3. Update the Code & Environment Variables
The current code has some sandbox-specific values that need to be updated.

#### A. Update `.env` with Live Credentials
```env
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_secret
```

#### B. Update `src/lib/paypal.ts`
Change the `base` URL and use environment variables:
```typescript
// Replace lines 1-3 with:
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const base = "https://api-m.paypal.com"; // REMOVE '.sandbox'
```

#### C. Update `src/components/PayPalProvider.tsx`
Use the environment variable for the client ID:
```typescript
// Update line 7-11:
const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "your_live_client_id";
```

---

## 🌐 Hosting Configuration (Vercel)

For both services to work on your live website, you **MUST** add these keys to your Vercel Project Settings:

1. Go to **Vercel Dashboard -> Project -> Settings -> Environment Variables**.
2. Add the following keys:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
3. Click **Save** and trigger a **Redeploy**.

---

## ✅ Pre-Live Checklist
- [ ] Account business verification completed for both Stripe and PayPal.
- [ ] Bank account linked for payouts.
- [ ] Environment variables updated in Vercel.
- [ ] Test one small real payment (e.g., $1.00) to ensure the full end-to-end flow works.
- [ ] Ensure `NEXT_PUBLIC_APP_URL` in Vercel is set to your production domain (e.g., `https://your-domain.com`).
