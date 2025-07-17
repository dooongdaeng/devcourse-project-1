"use client";

import { useState, useEffect } from 'react';
import { useProducts, User } from '@/context/ProductContext';

export default function UserInfoPage() {
  const { currentUser } = useProducts();
  // const [user, setUser] = useState<User | null>(null);
  // const [isEditingName, setIsEditingName] = useState(false);
  // const [isEditingPostalCode, setIsEditingPostalCode] = useState(false);
  // const [isEditingAddress, setIsEditingAddress] = useState(false);
  // const [editedName, setEditedName] = useState('');
  // const [editedPostalCode, setEditedPostalCode] = useState('');
  // const [editedAddress, setEditedAddress] = useState('');

  // useEffect(() => {
  //   if (currentUser) {
  //     setUser(currentUser);
  //     setEditedName(currentUser.name);
  //     setEditedPostalCode(currentUser.postalCode);
  //     setEditedAddress(currentUser.address);
  //   }
  // }, [currentUser]);

  // const handleEdit = (field: string) => {
  //   if (field === 'name') {
  //     setIsEditingName(true);
  //   } else if (field === 'postalCode') {
  //     setIsEditingPostalCode(true);
  //   } else if (field === 'address') {
  //     setIsEditingAddress(true);
  //   }
  // };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
  //   if (field === 'name') {
  //     setEditedName(e.target.value);
  //   } else if (field === 'postalCode') {
  //     setEditedPostalCode(e.target.value);
  //   } else if (field === 'address') {
  //     setEditedAddress(e.target.value);
  //   }
  // };

  // const handleSave = (field: string) => {
  //   if (!user) return;

  //   let updatedUser: User = { ...user };

  //   if (field === 'name') {
  //     updatedUser = { ...updatedUser, name: editedName };
  //     setIsEditingName(false);
  //   } else if (field === 'postalCode') {
  //     updatedUser = { ...updatedUser, postalCode: editedPostalCode };
  //     setIsEditingPostalCode(false);
  //   } else if (field === 'address') {
  //     updatedUser = { ...updatedUser, address: editedAddress };
  //     setIsEditingAddress(false);
  //   }
  //   setUser(updatedUser);
  //   // In a real application, you would call a function from your context to update the user in the global state.
  //   // e.g., updateUser(updatedUser);
  //   alert(`${field} 정보가 업데이트되었습니다.`);
  // };

  // const handleCancel = (field: string) => {
  //   if (!user) return;

  //   if (field === 'name') {
  //     setEditedName(user.name);
  //     setIsEditingName(false);
  //   } else if (field === 'postalCode') {
  //     setEditedPostalCode(user.postalCode);
  //     setIsEditingPostalCode(false);
  //   } else if (field === 'address') {
  //     setEditedAddress(user.address);
  //     setIsEditingAddress(false);
  //   }
  // };

  if (!currentUser) {
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
            <span className="font-medium text-gray-700">{currentUser.userId}</span>
          </div>

          {/* 이름 */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">이름:</span>
            <span className="font-medium text-gray-700">{currentUser.name}</span>
          </div>

          {/* 우편번호 */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">우편번호:</span>
            <span className="font-medium text-gray-700">{currentUser.postalCode}</span>
          </div>

          {/* 주소 */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">주소:</span>
            <span className="font-medium text-gray-700">{currentUser.address}</span>
          </div>

          {/* 가입일 (수정 불가) */}
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">가입일:</span>
            <span className="font-medium text-gray-700">{currentUser.signupDate}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
