"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { apiFetch } from '@/lib/backend/client';
import type { components } from '@/lib/backend/apiV1/schema';
import React from 'react';

interface ApiResponseError {
  resultCode: string;
  msg: string;
  data?: unknown;
}

type UserLoginReqBody = components['schemas']['UserLoginReqBody'];
type RsDataUserDto = components['schemas']['RsDataUserDto'];

export default function Login() {
  const router = useRouter();
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const requestBody: UserLoginReqBody = { username, password };

    try {
      const response: RsDataUserDto = await apiFetch('/api/v1/users/login', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      // HTTP 상태 코드 2xx 응답 (성공)
      if (response.resultCode === '200') {
        const userData = response.data;
        if (userData) {
          login(userData);
          alert('로그인 성공!');
          router.push('/');
        } else {
          setError('로그인 데이터가 올바르지 않습니다.');
        }
      } else {
        setError(response.msg || '알 수 없는 로그인 오류가 발생했습니다.');
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'resultCode' in err && 'msg' in err) {
        const apiError = err as ApiResponseError;
        console.error('API 오류 발생:', apiError.resultCode, apiError.msg);
        setError(apiError.msg);
      } else if (err instanceof Error) {
        console.error('클라이언트 측 오류 발생:', err.message);
        setError(`오류 발생: ${err.message}`);
      } else {
        console.error('알 수 없는 오류 발생:', err);
        setError('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      // min-h-screen, justify-center, transform -translate-y-20 클래스를 제거했습니다.
      // 이렇게 하면 상단바와의 겹침을 방지하고 레이아웃이 올바르게 작동합니다.
      <main className="flex flex-col items-center p-4" style={{paddingTop: '10rem'}}>
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">로그인</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-lg font-bold mb-2">
                사용자 ID:
              </label>
              <input
                  type="text"
                  id="username"
                  className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full py-2 px-3 text-gray-700 text-lg"
                  placeholder="사용자 ID를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-lg font-bold mb-2">
                비밀번호:
              </label>
              <input
                  type="password"
                  id="password"
                  className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full py-2 px-3 text-gray-700 text-lg"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div className="flex items-center justify-between">
              <button
                  type="submit"
                  className="bg-blue-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer"
                  disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-600">
                계정이 없으신가요?{" "}
                <button
                    type="button"
                    onClick={() => router.push('/signup')}
                    className="text-blue-950 hover:text-blue-800 font-bold cursor-pointer"
                >
                  회원가입
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
  );
}
