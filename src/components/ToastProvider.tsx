'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    zIndex: 999999,
                    background: '#0f141c',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                },
                success: {
                    iconTheme: {
                        primary: '#2563eb',
                        secondary: '#fff',
                    },
                },
            }}
            containerStyle={{
                zIndex: 999999,
                top: 20,
            }}
        />
    );
}
