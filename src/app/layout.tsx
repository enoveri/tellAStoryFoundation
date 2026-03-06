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
  title: "Tell A Story",
  description: "Mobile-first storytelling platform UI for the Tell A Story NGO",
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
