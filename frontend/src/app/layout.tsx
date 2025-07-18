"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductProvider } from '@/context/ProductContext';
import { UserProvider, useUser } from '@/context/UserContext';
import React from 'react';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

function AppContent({ children }: { children: React.ReactNode }) {
    const { user: currentUser, logout } = useUser();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        alert('로그아웃 되었습니다.');
        router.push('/login');
    };

    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased}`}
        >
        <header className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    Grids & Circles
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/products" className="hover:text-gray-300">
                                제품소개
                            </Link>
                        </li>
                        <li>
                            <Link href="/order" className="hover:text-gray-300">
                                주문
                            </Link>
                        </li>
                        {currentUser && (
                            <>
                                <li>
                                    <Link href="/orderHistory" className="hover:text-gray-300">
                                        주문내역
                                    </Link>
                                </li>
                                {currentUser.role !== 'ROLE_ADMIN' && (
                                    <li>
                                        <Link href="/account/client" className="hover:text-gray-300">
                                            회원정보
                                        </Link>
                                    </li>
                                )}
                                {currentUser.role === 'ROLE_ADMIN' && (
                                    <>
                                        <li>
                                            <Link href="/account/admin/accountManagement" className="hover:text-gray-300">
                                                회원정보관리
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/account/admin/productManagement" className="hover:text-gray-300">
                                                상품관리
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/account/admin/orderManagement" className="hover:text-gray-300">
                                                주문관리
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </>
                        )}
                        <li>
                            {currentUser ? (
                                <button onClick={handleLogout} className="hover:text-gray-300 cursor-pointer">
                                    로그아웃
                                </button>
                            ) : (
                                <Link href="/login" className="hover:text-gray-300">
                                    로그인
                                </Link>
                            )}
                        </li>
                        {!currentUser && (
                            <li>
                                <Link href="/signup" className="hover:text-gray-300">
                                    회원가입
                                </Link>
                            </li>
                        )}
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

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased}`}>
        <UserProvider>
            <ProductProvider>
                <AppContent>{children}</AppContent>
            </ProductProvider>
        </UserProvider>
        </body>
        </html>
    );
}