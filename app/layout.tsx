import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ai Glow — AI Skincare Companion",
  description: "Your personal AI skincare companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} h-full`}
      style={
        {
          "--font-serif": `var(--font-fraunces), 'Times New Roman', serif`,
          "--font-sans": `var(--font-inter-tight), -apple-system, BlinkMacSystemFont, system-ui, sans-serif`,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
