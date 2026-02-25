import Stripe from 'stripe';
const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51PLACEHOLDER';

export const stripe = new Stripe(secretKey, {
    apiVersion: '2026-01-28.clover' as any,
});
