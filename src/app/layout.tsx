import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import PayPalProvider from "@/components/PayPalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spark Holding Group - Money Lending & Financial Solutions",
  description: "Empowering your financial journey with flexible money lending, strategic investments, and expert financial advisory in Rwanda.",
  icons: {
    icon: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PayPalProvider>
          <ToastProvider />
          {children}
        </PayPalProvider>
      </body>
    </html>
  );
}

