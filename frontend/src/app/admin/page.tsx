"use client";

import { useState, ChangeEvent } from 'react';
import { useProducts, Product, User } from '@/context/ProductContext';

// Define a type for the new/edit product form state
type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
};

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, users, deleteUser } = useProducts();

  const initialProductFormState: ProductFormState = {
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductFormState>(initialProductFormState);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // --- Handlers for Deleting Products ---
  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      deleteProduct(productId);
    }
  };

  // --- Handlers for User Management ---
  const handleDeleteUser = (userId: number) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      deleteUser(userId);
    }
  };

  // --- Handlers for Adding Products ---
  const handleAddNewClick = () => {
    setShowAddForm(true);
    setEditingProduct(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewProduct = () => {
    const priceNum = parseInt(newProduct.price, 10);
    const stockNum = parseInt(newProduct.stock, 10);

    if (!newProduct.name || !newProduct.description || isNaN(priceNum) || priceNum <= 0 || isNaN(stockNum) || stockNum < 0) {
      alert('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    addProduct({ 
        ...newProduct, 
        price: `${priceNum}`,
        stock: stockNum,
    });

    setNewProduct(initialProductFormState);
    setShowAddForm(false);
  };

  // --- Handlers for Editing Products ---
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(false);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const priceNum = parseInt(editingProduct.price, 10);
    const stockNum = editingProduct.stock;

    if (!editingProduct.name || !editingProduct.description || isNaN(priceNum) || priceNum <= 0 || isNaN(stockNum) || stockNum < 0) {
      alert('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  // --- General Cancel Handler ---
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    setNewProduct(initialProductFormState);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">관리자 페이지</h2>

        {/* 회원 정보 조회 UI (Omitted for brevity) */}
        <section className="mb-12">
           <h3 className="text-2xl font-semibold text-gray-700 mb-6">회원 정보 조회</h3>
           <div className="overflow-x-auto">
             <table className="min-w-full bg-white border border-gray-200 rounded-md">
               <thead>
                 <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                   <th className="py-3 px-6 text-left">ID</th>
                   <th className="py-3 px-6 text-left">이메일</th>
                   <th className="py-3 px-6 text-left">이름</th>
                   <th className="py-3 px-6 text-left">우편번호</th>
                   <th className="py-3 px-6 text-left">주소</th>
                   <th className="py-3 px-6 text-left">가입일</th>
                   <th className="py-3 px-6 text-center">액션</th>
                 </tr>
               </thead>
               <tbody className="text-gray-600 text-sm">
                 {users.map(user => (
                   <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                     <td className="py-3 px-6 text-left whitespace-nowrap">{user.id}</td>
                     <td className="py-3 px-6 text-left">{user.email}</td>
                     <td className="py-3 px-6 text-left">{user.name}</td>
                     <td className="py-3 px-6 text-left">{user.postalCode}</td>
                     <td className="py-3 px-6 text-left">{user.address}</td>
                     <td className="py-3 px-6 text-left">{user.signupDate}</td>
                     <td className="py-3 px-6 text-center">
                       <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs cursor-pointer">삭제</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </section>

        {/* 상품 관리 UI */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-700">상품 관리</h3>
            <button
              onClick={handleAddNewClick}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              새 상품 추가
            </button>
          </div>

          {/* Add/Edit Form Section */}
          {(showAddForm || editingProduct) && (
            <div className="mt-6 mb-6 p-6 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-700 mb-4">
                {editingProduct ? '상품 정보 수정' : '새 상품 정보 입력'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
                  <input type="text" name="name" id="name" value={editingProduct ? editingProduct.name : newProduct.name} onChange={editingProduct ? handleEditInputChange : handleInputChange} className="w-full p-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">가격 (원)</label>
                  <input type="number" name="price" id="price" value={editingProduct ? editingProduct.price : newProduct.price} onChange={editingProduct ? handleEditInputChange : handleInputChange} className="w-full p-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">재고</label>
                  <input type="number" name="stock" id="stock" value={editingProduct ? editingProduct.stock : newProduct.stock} onChange={editingProduct ? handleEditInputChange : handleInputChange} className="w-full p-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">상품 이미지 URL</label>
                  <input type="text" name="imageUrl" id="imageUrl" placeholder="https://example.com/image.png" value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl} onChange={editingProduct ? handleEditInputChange : handleInputChange} className="w-full p-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">상품 설명</label>
                  <textarea name="description" id="description" value={editingProduct ? editingProduct.description : newProduct.description} onChange={editingProduct ? handleEditInputChange : handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md text-gray-900"></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button onClick={editingProduct ? handleUpdateProduct : handleSaveNewProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                  {editingProduct ? '수정 완료' : '저장'}
                </button>
                <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer">취소</button>
              </div>
            </div>
          )}

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
                    <td className="py-3 px-6 text-left">{product.price}원</td>
                    <td className="py-3 px-6 text-left">{product.stock}</td>
                    <td className="py-3 px-6 text-center">
                      <button onClick={() => handleEditClick(product)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2 cursor-pointer">수정</button>
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

