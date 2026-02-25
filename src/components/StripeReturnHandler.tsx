'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Props {
    onSuccess: () => void;
}

export default function StripeReturnHandler({ onSuccess }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hasHandled = useRef(false); // Prevent double-firing in React StrictMode

    useEffect(() => {
        const stripeStatus = searchParams.get('stripe_status');
        const sessionId = searchParams.get('session_id');

        if (hasHandled.current) return;

        if (stripeStatus === 'success' && sessionId) {
            hasHandled.current = true;
            const pending = localStorage.getItem('stripe_pending');
            if (!pending) {
                toast.error('Could not find pending payment data.');
                router.replace('/dashboard/portfolio');
                return;
            }

            const { amountRwf, investmentId, description } = JSON.parse(pending);
            const token = localStorage.getItem('token');

            fetch('/api/stripe/confirm-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId, amountRwf, investmentId, description })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        toast.success('Stripe payment confirmed! 🎉');
                        localStorage.removeItem('stripe_pending');
                        onSuccess();
                    } else if (data.alreadyProcessed) {
                        // Silently ignore - already recorded
                        localStorage.removeItem('stripe_pending');
                    } else {
                        toast.error(data.error || data.message || 'Could not confirm payment');
                    }
                })
                .catch(() => toast.error('Network error confirming payment'));

            router.replace('/dashboard/portfolio');

        } else if (stripeStatus === 'cancel') {
            hasHandled.current = true;
            toast('Payment cancelled.', { icon: '↩️' });
            router.replace('/dashboard/portfolio');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null; // This component renders nothing visual
}
