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
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Grids & Circles
            </Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="hover:text-gray-300">
                    메인(제품소개포함)
                  </Link>
                </li>
                <li>
                  <Link href="/order" className="hover:text-gray-300">
                    주문
                  </Link>
                </li>
                <li>
                  <Link href="/orderHistory" className="hover:text-gray-300">
                    주문내역
                  </Link>
                </li>
                <li>
                  <Link href="/orderHistory" className="hover:text-gray-300">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link href="/orderHistory" className="hover:text-gray-300">
                    회원가입
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
