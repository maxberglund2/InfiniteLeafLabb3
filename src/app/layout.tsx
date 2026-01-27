"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import Iridescence from "@/components/ui/Iridescence";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Background with Iridescence */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Iridescence
            color={[0.07, 0.3, 0.15]}
            mouseReact
            amplitude={0.1}
            speed={0.2}
          />
        </div>

        {/* Blur Overlay for Menu */}
        <div
          id="blurOverlay"
          className="fixed inset-0 w-full h-full backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
          style={{
            zIndex: 39,
            opacity: 0,
            pointerEvents: "none",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        />

        {/* App */}
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
