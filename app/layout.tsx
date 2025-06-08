"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import { usePathname } from 'next/navigation';
import Player from '@/components/Player';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTrackPage = pathname?.startsWith('/track/');

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <main className="pb-24">
          <ClientLayout>{children}</ClientLayout>
        </main>
        <Player />
      </body>
    </html>
  );
}
