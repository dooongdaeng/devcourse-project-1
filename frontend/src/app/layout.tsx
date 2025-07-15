"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <div className="flex justify-between items-center">Grids & Circles</div>
          <ul className="flex gap-4">
            <li>
              <Link href="/">메인(제품소개포함)</Link>
            </li>
            <li>
              <Link href="/order">주문</Link>
            </li>
            <li>
              <Link href="/orderHistory">주문내역</Link>
            </li>
          </ul>
        </header>
        <main>{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
