import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ProviderLayout from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Otakudesu",
  description: "Build by rizkyhaksono",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ProviderLayout>{children}</ProviderLayout>
      </body>
    </html>
  );
}
