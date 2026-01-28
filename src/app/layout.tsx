"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import Iridescence from "@/components/ui/Iridescence";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            color={[0.03, 0.15, 0.08]}
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

        {/* Toast Container */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName=""
          progressClassName="!bg-emerald"
          style={{ zIndex: 99999 }}
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
