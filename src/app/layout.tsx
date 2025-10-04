import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import "./globals.css";
import "./monologue-panel.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monolab - Korg Monologue Patch Manager",
  description: "Web-based patch manager and editor for the Korg Monologue synthesizer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
