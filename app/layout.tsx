import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "PropIQ — AI Real Estate Conversion System",
  description:
    "AI-powered real estate lead qualification, appointment booking, and conversion system. Turn inquiries into closed deals automatically.",
  keywords: ["real estate", "AI", "appointment booking", "lead qualification", "CRM"],
  authors: [{ name: "PropIQ" }],
  openGraph: {
    title: "PropIQ — AI Real Estate Conversion System",
    description: "Turn property inquiries into booked consultations automatically with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-white min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
