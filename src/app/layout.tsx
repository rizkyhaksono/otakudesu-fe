import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import ProviderLayout from "./provider";
import { Bebas_Neue, Inter } from "next/font/google";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fontBebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  title: "Otakudesu",
  description: "Build by rizkyhaksono",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontInter.className,
          fontBebasNeue.variable
        )}
      >
        <ProviderLayout>{children}</ProviderLayout>
      </body>
    </html>
  );
}
