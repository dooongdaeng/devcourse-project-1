"use client";

import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext';
import type { components } from '@/lib/backend/apiV1/schema';
import { apiFetch } from '@/lib/backend/client';

type User = components['schemas']['UserDto'];

const useUsers = () => {
  const [ users, setUsers ] = useState<User[] | null>(null);

  useEffect(() => {
    apiFetch('/api/v1/adm/users')
      .then(setUsers)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
  }, []);

  const deleteUser = (id: number, onSuccess: (data: any) => void) => {
    apiFetch(`/api/v1/adm/users/${id}`, {
      method: "DELETE"
    }).then(onSuccess)
    .catch((error) => {
      alert(`${error.resultCode} : ${error.msg}`);
    });
  };

  return { users, setUsers, deleteUser };
}

export default function AccountManagement() {
  const { users, setUsers, deleteUser } = useUsers();

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      deleteUser(userId, (res) => {
        alert(res.msg);
        if(users == null) return;
        setUsers(users.filter((user) => user.id ! == userId));
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">회원 정보 조회</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">사용자 ID</th>
                <th className="py-3 px-6 text-left">이름</th>
                <th className="py-3 px-6 text-left">우편번호</th>
                <th className="py-3 px-6 text-left">주소</th>
                <th className="py-3 px-6 text-left">가입일</th>
                <th className="py-3 px-6 text-left">역할</th>
                <th className="py-3 px-6 text-center">액션</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {users?.map(user => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{user.id}</td>
                  <td className="py-3 px-6 text-left">{user.username}</td>
                  <td className="py-3 px-6 text-left">{user.nickname}</td>
                  <td className="py-3 px-6 text-left">{user.postalCode}</td>
                  <td className="py-3 px-6 text-left">{user.address}</td>
                  <td className="py-3 px-6 text-left">{user.signupDate}</td>
                  <td className="py-3 px-6 text-left">{user.role}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs cursor-pointer">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}