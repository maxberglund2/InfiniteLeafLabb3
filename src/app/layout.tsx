"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
        <div className="relative z-99999">
          <AuthProvider>
            <Navbar />
            <main className="z-99999">{children}</main>
            <Footer />
          </AuthProvider>
        </div>

        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
          <Iridescence
            color={[0, 0.2, 0.1]}
            mouseReact
            amplitude={0.1}
            speed={0.2}
          />
          <button className="text-blue-500 bg-red-700">hello</button>
        </div>
      </body>
    </html>
  );
}
