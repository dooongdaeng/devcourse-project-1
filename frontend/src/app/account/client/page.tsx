"use client";

import { useEffect, useState } from 'react';
import { useUser, User } from '@/context/UserContext';
import React from 'react';

export default function UserInfoPage() {
  const { user: currentUser } = useUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  if (!user) {
    return <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">로딩 중...</div>;
  }

  return (
      <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">회원 정보</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">사용자 ID:</span>
              <span className="font-medium text-gray-700">{user.username}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">닉네임:</span>
              <span className="font-medium text-gray-700">{user.nickname}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">이메일:</span>
              <span className="font-medium text-gray-700">{user.email}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">우편번호:</span>
              <span className="font-medium text-gray-700">{user.postalCode}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">주소:</span>
              <span className="font-medium text-gray-700">{user.address}</span>
            </div>
          </div>
        </div>
      </main>
  );
}