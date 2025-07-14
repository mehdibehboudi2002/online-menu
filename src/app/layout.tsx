import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Menu",
  description: "A beautifully crafted online menu with Redux & Tailwind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}
