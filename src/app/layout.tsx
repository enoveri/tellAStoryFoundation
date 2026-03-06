import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOneTap } from "@/components/auth/google-one-tap";
import { AboutProvider } from "@/context/about-context";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://tellastoryfoundation.org",
  ),
  title: {
    default: "TAS | Tell A Story",
    template: "%s | TAS",
  },
  description: "Mobile-first storytelling platform UI for the Tell A Story NGO",
  icons: {
    icon: "/TAS2.svg",
    shortcut: "/TAS2.svg",
    apple: "/TAS2.svg",
  },
  openGraph: {
    siteName: "TAS | Tell A Story",
    images: [
      {
        url: "/TAS2.svg",
        alt: "TAS logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/TAS2.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[color:var(--background)] text-[color:var(--foreground)] antialiased`}
      >
        <AboutProvider>
          <GoogleOneTap />
          {children}
        </AboutProvider>
      </body>
    </html>
  );
}
