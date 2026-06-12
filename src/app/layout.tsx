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
    default:
      "LaneStomp | League of Legends Matchup Guides, Counter Picks & Champion Data",
    template: "%s | LaneStomp",
  },

  description:
    "Find League of Legends matchup guides, counter picks, champion data, power spikes, and role-specific advice. Prepare before champion select and win more games with LaneStomp.",

  applicationName: "LaneStomp",
  openGraph: {
  title:
    "LaneStomp | League of Legends Matchup Guides & Counter Picks",

  description:
    "Prepare before champion select with matchup guides, counter picks, champion data, power spikes, and role-specific advice.",

  type: "website",
  siteName: "LaneStomp",
  url: "https://lanestomp.com",
  },
  twitter: {
  card: "summary_large_image",

  title:
    "LaneStomp | League of Legends Matchup Guides & Counter Picks",

  description:
    "Prepare before champion select with matchup guides, counter picks, champion data, power spikes, and role-specific advice.",
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
        <head>
          <meta name="google-adsense-account" content="ca-pub-5753142354034551"></meta>
        </head>
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
