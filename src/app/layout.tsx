import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "../layouts/Header";
import DirectionManager from "../components/DirectionManager";
import { getCurrentLanguage } from "../lib/getLanguage";
import QueryProvider from "@/lib/QueryProvider";
import Footer from "@/layouts/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Menu",
  description: "A beautifully crafted online menu with Redux & Tailwind",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getCurrentLanguage() as 'en' | 'fa';

  return (
    <html lang={lang} dir={lang === "fa" ? "rtl" : "ltr"}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased theme-background`}>
        <div suppressHydrationWarning={true}>
          <Providers initialLanguage={lang}>
            <Header />
            <DirectionManager />
            <QueryProvider>
              {children}
            </QueryProvider>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}