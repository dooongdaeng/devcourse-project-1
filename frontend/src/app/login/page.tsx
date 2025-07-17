"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductContext";

export default function Login() {
  const router = useRouter();
  const { login } = useProducts();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(userId, password)) {
      alert('로그인 성공!');
      router.push('/');
    } else {
      alert('사용자 ID 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">로그인</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              사용자 ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="사용자 ID를 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
          >
            로그인
          </button>
        </form>
      </div>
    </main>
  );
}
