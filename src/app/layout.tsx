import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSidebar from "@/components/FloatingSidebar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Site-wide venue entity for structured data.
// Gives search engines the actual business (NAP + hours + socials) instead of
// only ever seeing BlogPosting. Blogger subdomain still points at the main site.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EventVenue"],
  "@id": "https://piccreativespace.id/#venue",
  name: "PIC Creative Space",
  alternateName: "PT. Pilar Inspirasi Citra",
  description:
    "Creative event space di Jakarta Selatan — The Sanctuary (sampai 150 pax), The Dwelling (sampai 30 pax), dan The Salt & Light (16 pax). Sewa per jam, event 24 jam.",
  url: "https://piccreativespace.id",
  telephone: "+62817731137",
  email: "info@piccreativespace.id",
  image: "https://blog.piccreativespace.id/og-default.png",
  priceRange: "Rp 500.000 - Rp 1.900.000 per jam",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Wisma Staco Ground Floor, Jl. Raya Casablanca kav.18, RT 04/RW.012, Menteng Dalam",
    addressLocality: "Tebet",
    addressRegion: "Jakarta Selatan",
    postalCode: "12870",
    addressCountry: "ID",
  },
  areaServed: { "@type": "City", name: "Jakarta" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  sameAs: [
    "https://www.instagram.com/piccreativespace",
    "https://www.tiktok.com/@piccreativespace",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.piccreativespace.id"),
  title: {
    default: "Blog — PIC Creative Space | Event Space Jakarta",
    template: "%s | Blog PIC Creative Space",
  },
  description:
    "Tips, inspirasi, dan panduan seputar event, venue, gathering, dan acara kreatif di Jakarta Selatan dari PIC Creative Space.",
  openGraph: {
    title: "Blog — PIC Creative Space",
    description:
      "Tips, inspirasi, dan panduan seputar event di Jakarta Selatan.",
    siteName: "PIC Creative Space",
    type: "website",
    locale: "id_ID",
    url: "https://blog.piccreativespace.id",
    images: [
      {
        url: "https://blog.piccreativespace.id/logo-piccs.jpg",
        width: 512,
        height: 512,
        alt: "PIC Creative Space",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          href="https://api.fontshare.com/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Site-wide venue structured data (LocalBusiness + EventVenue) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <FloatingSidebar />
      </body>
    </html>
  );
}
