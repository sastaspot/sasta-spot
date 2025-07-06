import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/hooks/use-currency"
import { GoogleAnalytics } from "@/components/google-analytics"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL("https://sastaspot.vercel.app"),
  title: {
    default: "Sasta Spot - Find Cheapest Deals & Save Money | Best Price Comparison India",
    template: "%s | Sasta Spot - Best Price Comparison India",
  },
  description:
    "Compare prices across Amazon, Flipkart, Myntra & 1000+ stores instantly. Find cheapest deals, save money on every purchase. India's #1 price comparison site with real-time prices.",
  keywords: [
    "price comparison India",
    "cheapest deals",
    "best prices",
    "save money online",
    "Amazon vs Flipkart",
    "discount finder",
    "online shopping deals",
    "price tracker",
    "bargain hunter",
    "lowest price guarantee",
    "e-commerce comparison",
    "shopping comparison",
    "deal finder India",
    "price drop alerts",
    "cashback deals",
  ],
  authors: [{ name: "Sasta Spot Team", url: "https://sastaspot.vercel.app" }],
  creator: "Sasta Spot",
  publisher: "Sasta Spot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sastaspot.vercel.app",
    title: "Sasta Spot - Find Cheapest Deals & Save Money | Best Price Comparison India",
    description:
      "Compare prices across Amazon, Flipkart, Myntra & 1000+ stores instantly. Find cheapest deals, save money on every purchase.",
    siteName: "Sasta Spot",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sasta Spot - India's Best Price Comparison Site",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sasta Spot - Find Cheapest Deals & Save Money",
    description:
      "Compare prices across 1000+ stores instantly. Save money on every purchase with India's #1 price comparison site.",
    images: ["/og-image.jpg"],
    creator: "@sastaspot",
    site: "@sastaspot",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "shopping",
  classification: "price comparison",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sasta Spot",
  description: "India's best price comparison website to find cheapest deals across 1000+ online stores",
  url: "https://sastaspot.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://sastaspot.vercel.app/?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Sasta Spot",
    url: "https://sastaspot.vercel.app",
    logo: {
      "@type": "ImageObject",
      url: "https://sastaspot.vercel.app/logo.png",
      width: 512,
      height: 512,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CurrencyProvider>
            <Suspense fallback={null}>
              {children}
              <GoogleAnalytics />
            </Suspense>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
