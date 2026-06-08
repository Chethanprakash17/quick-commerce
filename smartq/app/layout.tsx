import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SimulationController from "@/components/simulation/SimulationController";

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
          {/* Sidebar placeholder */}
          <div className="w-[240px] bg-[#0E1628] border-r border-[#1E2D45] hidden md:flex" />

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
