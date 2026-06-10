import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/src/components/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lanestomp.com"),
  title: {
    default: "LaneStomp",
    template: "%s | LaneStomp",
  },
  description:
    "LaneStomp helps League players master matchups, improve champion pools, and climb with confidence.",
  applicationName: "LaneStomp",
  openGraph: {
    description:
      "LaneStomp helps League players master matchups, improve champion pools, and climb with confidence.",
    images: [
      {
        alt: "LaneStomp League matchup improvement platform",
        height: 630,
        url: "/opengraph-image.png",
        width: 1200,
      },
    ],
    siteName: "LaneStomp",
    title: "LaneStomp",
    type: "website",
    url: "https://lanestomp.com",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "LaneStomp helps League players master matchups, improve champion pools, and climb with confidence.",
    images: [
      {
        alt: "LaneStomp League matchup improvement platform",
        url: "/twitter-image.png",
      },
    ],
    title: "LaneStomp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      
      <body className="min-h-full flex flex-col">
        <Script
  async
  strategy="afterInteractive"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5753142354034551"
  crossOrigin="anonymous"
/>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J36C3YD0FN"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-J36C3YD0FN');
  `}
        </Script>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
