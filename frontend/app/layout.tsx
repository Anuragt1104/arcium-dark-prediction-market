import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/lib/wallet";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dark Prediction Market - Privacy-First Predictions on Solana",
  description: "Built with Arcium's encrypted compute - Keep your bets private, markets fair",
  keywords: ["solana", "prediction market", "privacy", "arcium", "mpc", "encrypted"],
  authors: [{ name: "Alenka Media" }],
  openGraph: {
    title: "Dark Prediction Market",
    description: "Privacy-preserving prediction markets using Arcium MPC on Solana",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
