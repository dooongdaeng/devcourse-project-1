"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/backend/client';
import type { components } from '@/lib/backend/apiV1/schema';
import React from 'react';

interface ApiResponseError {
  resultCode: string;
  msg: string;
  data?: unknown;
}

type UserJoinReqBody = components['schemas']['UserJoinReqBody'];
type RsDataUserDto = components['schemas']['RsDataUserDto'];

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      alert('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    if (!username || !password || !nickname || !postalCode || !address || !email) {
      setError('모든 필드를 입력해주세요.');
      alert('모든 필드를 입력해주세요.');
      setLoading(false);
      return;
    }

    const requestBody: UserJoinReqBody = {
      username,
      password,
      nickname,
      email,
      address,
      postalCode,
    };

    try {
      const response: RsDataUserDto = await apiFetch('/api/v1/users/signup', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      if (response.resultCode === '201') {
        alert('회원가입이 완료되었습니다. 로그인 해주세요.');
        router.push('/login');
      } else {
        setError(response.msg || '알 수 없는 회원가입 오류가 발생했습니다.');
        alert(`회원가입 실패: ${response.msg || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'resultCode' in err && 'msg' in err) {
        const apiError = err as ApiResponseError;
        console.error('회원가입 API 오류 발생:', apiError.resultCode, apiError.msg);
        setError(apiError.msg);
        alert(`회원가입 실패: ${apiError.msg}`);
      } else if (err instanceof Error) {
        console.error('클라이언트 측 오류 발생:', err.message);
        setError(`오류 발생: ${err.message}`);
        alert(`회원가입 중 오류가 발생했습니다: ${err.message}`);
      } else {
        console.error('알 수 없는 오류 발생:', err);
        setError('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        alert('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">회원가입</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                사용자 ID
              </label>
              <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder="사용자 ID를 입력하세요"
                  required
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
                  required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
              />
            </div>
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                닉네임
              </label>
              <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder="닉네임을 입력하세요"
                  required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder="이메일을 입력하세요"
                  required
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                우편번호
              </label>
              <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder="우편번호를 입력하세요"
                  required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                주소
              </label>
              <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder="주소를 입력하세요"
                  required
              />
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>} {}
            <button
                type="submit"
                className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
                disabled={loading} // 로딩 중 버튼 비활성화
            >
              {loading ? '회원가입 중...' : '회원가입'} {}
            </button>
            <div className="text-center mt-4">
              <p className="text-gray-600">
                이미 계정이 있으신가요?{" "}
                <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="text-blue-500 hover:text-blue-800 font-bold cursor-pointer"
                >
                  로그인
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
  );
}