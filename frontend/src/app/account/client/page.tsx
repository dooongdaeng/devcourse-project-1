"use client";

import { useState, useEffect } from 'react';
import { User } from '@/context/ProductContext';

export default function UserInfoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPostalCode, setIsEditingPostalCode] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPostalCode, setEditedPostalCode] = useState('');
  const [editedAddress, setEditedAddress] = useState('');

  useEffect(() => {
    // 임시 하드코딩된 사용자 정보
    const dummyUser: User = {
      id: 1,
      userId: 'testuser',
      name: '테스트 사용자',
      postalCode: '12345',
      address: '서울시 강남구 테스트동 123-45',
      signupDate: '2023-01-01',
    };
    setUser(dummyUser);
    setEditedName(dummyUser.name);
    setEditedPostalCode(dummyUser.postalCode);
    setEditedAddress(dummyUser.address);
  }, []);

  const handleEdit = (field: string) => {
    if (field === 'name') {
      setIsEditingName(true);
    } else if (field === 'postalCode') {
      setIsEditingPostalCode(true);
    } else if (field === 'address') {
      setIsEditingAddress(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (field === 'name') {
      setEditedName(e.target.value);
    } else if (field === 'postalCode') {
      setEditedPostalCode(e.target.value);
    } else if (field === 'address') {
      setEditedAddress(e.target.value);
    }
  };

  const handleSave = (field: string) => {
    if (!user) return;

    let updatedUser: User = { ...user };

    if (field === 'name') {
      updatedUser = { ...updatedUser, name: editedName };
      setIsEditingName(false);
    } else if (field === 'postalCode') {
      updatedUser = { ...updatedUser, postalCode: editedPostalCode };
      setIsEditingPostalCode(false);
    } else if (field === 'address') {
      updatedUser = { ...updatedUser, address: editedAddress };
      setIsEditingAddress(false);
    }
    setUser(updatedUser);
    // 실제 애플리케이션에서는 여기서 백엔드 API 호출하여 사용자 정보 업데이트
    alert(`${field} 정보가 업데이트되었습니다.`);
  };

  const handleCancel = (field: string) => {
    if (!user) return;

    if (field === 'name') {
      setEditedName(user.name);
      setIsEditingName(false);
    } else if (field === 'postalCode') {
      setEditedPostalCode(user.postalCode);
      setIsEditingPostalCode(false);
    } else if (field === 'address') {
      setEditedAddress(user.address);
      setIsEditingAddress(false);
    }
  };

  if (!user) {
    return <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">로딩 중...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">회원 정보</h2>
        <div className="space-y-4">
          {/* 사용자 ID (수정 불가) */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">사용자 ID:</span>
            <span className="font-medium text-gray-700">{user.userId}</span>
          </div>

          {/* 이름 */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">이름:</span>
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => handleChange(e, 'name')}
                  className="p-1 border border-gray-300 rounded-md text-gray-700 w-40"
                />
                <button onClick={() => handleSave('name')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer">저장</button>
                <button onClick={() => handleCancel('name')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer">취소</button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">{user.name}</span>
                <button onClick={() => handleEdit('name')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer">수정</button>
              </div>
            )}
          </div>

          {/* 우편번호 */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">우편번호:</span>
            {isEditingPostalCode ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editedPostalCode}
                  onChange={(e) => handleChange(e, 'postalCode')}
                  className="p-1 border border-gray-300 rounded-md text-gray-700 w-40"
                />
                <button onClick={() => handleSave('postalCode')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer">저장</button>
                <button onClick={() => handleCancel('postalCode')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer">취소</button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">{user.postalCode}</span>
                <button onClick={() => handleEdit('postalCode')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer">수정</button>
              </div>
            )}
          </div>

          {/* 주소 */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">주소:</span>
            {isEditingAddress ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editedAddress}
                  onChange={(e) => handleChange(e, 'address')}
                  className="p-1 border border-gray-300 rounded-md text-gray-700 w-40"
                />
                <button onClick={() => handleSave('address')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer">저장</button>
                <button onClick={() => handleCancel('address')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer">취소</button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">{user.address}</span>
                <button onClick={() => handleEdit('address')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer">수정</button>
              </div>
            )}
          </div>

          {/* 가입일 (수정 불가) */}
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">가입일:</span>
            <span className="font-medium text-gray-700">{user.signupDate}</span>
          </div>
        </div>
      </div>
    </main>
  );
}