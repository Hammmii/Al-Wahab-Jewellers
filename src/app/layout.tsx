import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { GoldRateProvider } from "@/context/GoldRateContext";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontHeadline = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-headline",
});

const fontUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
});


export const metadata: Metadata = {
  title: "Al-Wahab Jewellers - Exquisite Gold Jewellery",
  description: "Discover the finest collection of gold jewellery in Pakistan. Al-Wahab Jewellers offers timeless elegance and craftsmanship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontBody.variable,
          fontHeadline.variable,
          fontUrdu.variable
        )}
      >
        <GoldRateProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </GoldRateProvider>
      </body>
    </html>
  );
}
