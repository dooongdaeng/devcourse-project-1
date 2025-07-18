import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react';
import ClientLayout from "./ClientLayout"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Grids & Circles",
    description: "Grids & Circles는 다양한 커피 메뉴를 손쉽게 주문하고 즐길 수 있는 스마트한 커피 주문 플랫폼입니다. 오늘도 당신의 커피 한 잔을 책임질게요!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased}`}
            >
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}