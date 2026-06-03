import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ToastProvider } from "@/components/ToastProvider";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Darshak Desai CRM",
  description:
    "Client relationship management for Darshak Desai Financial Services.",
};

export const viewport: Viewport = {
  themeColor: "#003366",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable}`}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
