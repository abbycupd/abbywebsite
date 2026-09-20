import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { profile } from "@/data/profile";
import { contact } from "@/data/contact";
import { CoffeeEasterEgg } from "@/components/coffee-easter-egg";
import { MotionConfig } from "framer-motion";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: site.titleTemplate,
  },
  description: profile.seoDescription,
  keywords: [
    "Abby Brennan",
    "Abby Brennan developer",
    "software developer",
    "Computer Science Queen's Belfast",
  ],
  authors: [{ name: "Abby Brennan", url: site.url }],
  creator: "Abby Brennan",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: profile.seoDescription,
    siteName: site.name,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: profile.seoDescription,
    ...(site.twitterHandle ? { creator: site.twitterHandle } : {}),
  },
  icons: {
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: site.url,
  jobTitle: profile.jobTitle,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Queen's University Belfast",
  },
  sameAs: contact.links.map((l) => l.href).filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-cream text-ink font-sans antialiased selection:bg-ink selection:text-cream">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          {children}
          <CoffeeEasterEgg />
        </MotionConfig>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
