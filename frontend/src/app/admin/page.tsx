"use client";

import { useState } from 'react';

// Define a type for product items
type Product = {
  id: number;
  name: string;
  price: string;
  stock: number;
};

export default function Admin() {
  // Initial product data
  const initialProducts: Product[] = [
    { id: 101, name: '콜롬비아 나리뇨', price: '5000원', stock: 100 },
    { id: 102, name: '브라질 세하도', price: '6000원', stock: 150 },
  ];

  // State for managing products
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Function to handle product deletion
  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">관리자 페이지</h2>

        {/* 회원 정보 조회 UI */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">회원 정보 조회</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">이메일</th>
                  <th className="py-3 px-6 text-left">이름</th>
                  <th className="py-3 px-6 text-left">가입일</th>
                  <th className="py-3 px-6 text-center">액션</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">1</td>
                  <td className="py-3 px-6 text-left">user1@example.com</td>
                  <td className="py-3 px-6 text-left">김철수</td>
                  <td className="py-3 px-6 text-left">2023-01-15</td>
                  <td className="py-3 px-6 text-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2 cursor-pointer">수정</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs cursor-pointer">삭제</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">2</td>
                  <td className="py-3 px-6 text-left">user2@example.com</td>
                  <td className="py-3 px-6 text-left">이영희</td>
                  <td className="py-3 px-6 text-left">2023-03-20</td>
                  <td className="py-3 px-6 text-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2 cursor-pointer">수정</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs cursor-pointer">삭제</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 상품 관리 UI */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-700">상품 관리</h3>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">새 상품 추가</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">상품명</th>
                  <th className="py-3 px-6 text-left">가격</th>
                  <th className="py-3 px-6 text-left">재고</th>
                  <th className="py-3 px-6 text-center">액션</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{product.id}</td>
                    <td className="py-3 px-6 text-left">{product.name}</td>
                    <td className="py-3 px-6 text-left">{product.price}</td>
                    <td className="py-3 px-6 text-left">{product.stock}</td>
                    <td className="py-3 px-6 text-center">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2 cursor-pointer">수정</button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs cursor-pointer"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
