import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SimulationController from "@/components/simulation/SimulationController";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "SMARTQ | Fulfillment & Delivery Optimization",
  description: "Quick Commerce Fulfillment and Delivery Optimization Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-base text-primary overflow-hidden`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <div className="w-[240px] bg-[#0E1628] border-r border-[#1E2D45] hidden md:flex flex-col">
             <div className="p-4 border-b border-[#1E2D45]">
                <h1 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                   SMARTQ
                </h1>
                <span className="text-xs text-[#64748B] font-mono mt-1 block">v2.0 DAA Edition</span>
             </div>
             <nav className="flex-1 p-2 flex flex-col gap-1 mt-4">
                <Link href="/dashboard" className="px-4 py-2 text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#162035] rounded-lg transition-colors">Dashboard</Link>
                <Link href="/orders" className="px-4 py-2 text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#162035] rounded-lg transition-colors">Order Management</Link>
                <Link href="/riders" className="px-4 py-2 text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#162035] rounded-lg transition-colors">Rider Operations</Link>
                <Link href="/engine" className="px-4 py-2 text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#162035] rounded-lg transition-colors">Optimization Engine</Link>
                <Link href="/algorithms" className="px-4 py-2 text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#162035] rounded-lg transition-colors">Algorithm Laboratory</Link>
             </nav>
          </div>

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Topbar placeholder */}
            <div className="h-[56px] bg-[#0E1628] border-b border-[#1E2D45]" />

            <main className="flex-1 overflow-auto bg-[#070C18]">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
        <SimulationController />
      </body>
    </html>
  );
}
