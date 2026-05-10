import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { Instrument_Serif } from "next/font/google"
import { Noto_Sans_Gujarati } from "next/font/google"
import Script from "next/script"
import { ThemeProvider } from "@/components/atoms/theme-provider"
import { Navigation } from "@/components/organisms/navigation"
import { AnnouncementBanner } from "@/components/atoms/announcement-banner"
import StickyFooter from "@/components/organisms/sticky-footer"
import { ScrollToTop } from "@/components/atoms/scroll-to-top"
import { FloatingMenuButton } from "@/components/organisms/floating-menu-button"
import { AudioPlayer } from "@/components/audio-player"
import { AudioProvider } from "@/contexts/audio-context"
import { LoadingProvider } from "@/hooks/use-loading"
import { getCloudflareImage } from "@/lib/cdn-assets"
import { VideoSchema } from "@/components/organisms/video-schema"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "block",
})

const notoGujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati"],
  weight: ["400", "700"],
  variable: "--font-gujarati",
  display: "block",
})





export const metadata: Metadata = {
  metadataBase: new URL("https://njrajatmahotsav.com"),
  title: {
    default: "NJ Rajat Mahotsav 2026 | Swaminarayan Temple Secaucus",
    template: "%s | NJ Rajat Mahotsav 2026"
  },
  description: "Join us for the Silver Jubilee celebration at Shree Swaminarayan Temple Secaucus, NJ from July 27 - August 2, 2026. Experience divine programs, seva opportunities, and community celebrations marking 25 years of spiritual service.",
  generator: "v0.app",
  icons: {
    icon: "https://cdn.njrajatmahotsav.com/main_logo.png",
  },
  openGraph: {
    title: "NJ Rajat Mahotsav 2026 | Swaminarayan Temple Secaucus",
    description: "Join us for the Silver Jubilee celebration at Shree Swaminarayan Temple Secaucus, NJ from July 27 - August 2, 2026. Experience divine programs, seva opportunities, and community celebrations marking 25 years of spiritual service.",
    url: "https://njrajatmahotsav.com",
    siteName: "NJ Rajat Mahotsav 2026",
    images: [
      {
        url: getCloudflareImage("5aeb6c7e-f6ea-45b1-da4a-823279172400"),
        width: 1200,
        height: 630,
        alt: "NJ Rajat Mahotsav 2026 - Silver Jubilee Celebration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NJ Rajat Mahotsav 2026 | Swaminarayan Temple Secaucus",
    description: "Join us for the Silver Jubilee celebration at Shree Swaminarayan Temple Secaucus, NJ from July 27 - August 2, 2026. Experience divine programs, seva opportunities, and community celebrations marking 25 years of spiritual service.",
    images: [getCloudflareImage("5aeb6c7e-f6ea-45b1-da4a-823279172400")],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        {/* bg-title-section-bg / preset-deep-navy */}
        <meta name="theme-color" content="#0D132D" />
        {/* Preload LCP image for better performance */}
        <link
          rel="preload"
          as="image"
          href="https://imagedelivery.net/vdFY6FzpM3Q9zi31qlYmGA/1443ce4a-1e60-4a83-34d8-f8626fe74b00/biggest?format=auto&quality=100"
          fetchPriority="high"
        />
        <VideoSchema />
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
  --font-gujarati: ${notoGujarati.variable};
}
        `}</style>
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable} ${notoGujarati.variable}`} suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1SD09GSK35"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1SD09GSK35');
          `}
        </Script>
        <LoadingProvider>
          <AudioProvider>
            <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
              <AnnouncementBanner />
              <Navigation />
              <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                  {children}
                </main>
                <StickyFooter />
              </div>
              <ScrollToTop />
              <FloatingMenuButton />
              <AudioPlayer />
            </ThemeProvider>
          </AudioProvider>
        </LoadingProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
