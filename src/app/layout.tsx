import type { Metadata } from "next";
import { Bodoni_Moda, Jost, Gulzar, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { GoldRateProvider } from "@/context/GoldRateContext";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { IntroLoader } from "@/components/loading/intro-loader";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { getLangFromCookie } from "@/lib/i18n/lang-cookie";

// Bodoni Moda — high-fashion Didone display serif (the look luxury houses use).
const fontDisplay = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
});

// Jost — geometric, editorial body sans (Futura-like). Pairs with the Didone.
const fontBody = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

// Gulzar — screen-optimized Nastaliq for the brand wordmark + large Urdu headings.
const fontUrduDisplay = Gulzar({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  variable: "--font-urdu-display",
  display: "swap",
});

// Noto Naskh Arabic — highly readable Naskh for Urdu body / UI text.
const fontUrduBody = Noto_Naskh_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-urdu-body",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Gold Jewellers in Multan`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Gold Jewellers in Multan`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLangFromCookie()
  const isUr = lang === 'ur'

  return (
    <html lang={lang} dir={isUr ? 'rtl' : 'ltr'} className={cn('dark', isUr && 'lang-ur')}>
      <head>
        <OrganizationJsonLd />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontBody.variable,
          fontDisplay.variable,
          fontUrduDisplay.variable,
          fontUrduBody.variable
        )}
      >
        <IntroLoader />
        <LanguageProvider initialLang={lang}>
        <GoldRateProvider>
          <SmoothScrollProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SmoothScrollProvider>
        </GoldRateProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
