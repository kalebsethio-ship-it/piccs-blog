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

export const metadata: Metadata = {
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
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <FloatingSidebar />
      </body>
    </html>
  );
}
