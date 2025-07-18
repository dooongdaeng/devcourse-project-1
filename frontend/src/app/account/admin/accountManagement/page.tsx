"use client";

import { useState, useEffect } from 'react';
import type { components } from '@/lib/backend/apiV1/schema';
import { apiFetch } from '@/lib/backend/client';

type User = components['schemas']['AdminUserDto'];

const useUsers = () => {
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    apiFetch<User[]>('/api/v1/adm/users')
        .then(response => {
          if (response && response.data) {
            setUsers(response.data);
          } else {
            setUsers([]);
          }
        })
        .catch((error) => {
          setUsers([]); // 오류 발생 시에도 빈 배열로 설정하여 테이블이 비어있음을 표시
          alert(`회원 정보 불러오기 실패: ${error.resultCode ? error.resultCode + ' : ' : ''}${error.msg || '알 수 없는 오류가 발생했습니다.'}`);
        });
  }, []);

  const deleteUser = (id: number, onSuccess: () => void) => {
    apiFetch(`/api/v1/adm/users/${id}`, {
      method: "DELETE"
    }).then(() => {
      onSuccess(); // 성공 콜백 호출
    })
        .catch((error) => {
          alert(`회원 삭제 실패: ${error.resultCode ? error.resultCode + ' : ' : ''}${error.msg || '알 수 없는 오류가 발생했습니다.'}`);
        });
  };

  return { users, setUsers, deleteUser };
}

export default function AccountManagement() {
  const { users, setUsers, deleteUser } = useUsers();

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      deleteUser(userId, () => {
        alert('회원이 성공적으로 삭제되었습니다.');
        setUsers(prevUsers => prevUsers ? prevUsers.filter(user => user.id !== userId) : []);
      });
    }
  };

  const formatDate = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) {
        return isoDate;
      }
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}.${month}.${day} ${hours}:${minutes}`;
    } catch (e) {
      return isoDate;
    }
  };

  if (users === null) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
          <div className="text-gray-700 text-lg">회원 정보를 불러오는 중입니다...</div>
        </main>
    );
  }

  if (users.length === 0) {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">회원 정보 조회</h2>
            <div className="text-center text-gray-600">회원 정보가 없습니다.</div>
          </div>
        </main>
    );
  }

  return (
      <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">회원 정보 조회</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-center">ID</th>
                <th className="py-3 px-6 text-center">사용자 ID</th>
                <th className="py-3 px-6 text-center">이름</th>
                <th className="py-3 px-6 text-center">우편번호</th>
                <th className="py-3 px-6 text-center">주소</th>
                <th className="py-3 px-6 text-center">가입일</th>
                <th className="py-3 px-6 text-center">역할</th>
                <th className="py-3 px-6 text-center">액션</th>
              </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
              {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-center whitespace-nowrap">{user.id}</td>
                    <td className="py-3 px-6 text-center">{user.username}</td>
                    <td className="py-3 px-6 text-center">{user.nickname}</td>
                    <td className="py-3 px-6 text-center">{user.postalCode}</td>
                    <td className="py-3 px-6 text-center">{user.address}</td>
                    <td className="py-3 px-6 text-center">{(user.createDate) ? formatDate(user.createDate) : ""}</td>
                    <td className="py-3 px-6 text-center">{user.role?.replace(/^ROLE_/, '')}</td>
                    <td className="py-3 px-6 text-center">
                      <button onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs cursor-pointer">
                        삭제
                      </button>
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