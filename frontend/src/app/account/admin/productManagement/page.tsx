"use client";

import { useState, ChangeEvent, useRef } from 'react';
import { useProductItem, useProduct } from '@/context/ProductsContext';
import type { components } from '@/lib/backend/apiV1/schema';

type Product = components['schemas']['ProductWithImageUrlDto'];

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
};

type ProductFormProps = {
  editingProduct: Product | null;
  onCancel: () => void;
  onSubmit: () => void; // 실제로는 addProduct/modifyProduct 호출 시 사용할 수 있음
};

function ProductForm({ editingProduct, onCancel, onSubmit }: ProductFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const stockInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const initialProductFormState: ProductFormState = {
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  };

  const [formState, setFormState] = useState<ProductFormState>(
    editingProduct
      ? {
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price.toString(),
          stock: editingProduct.stock.toString(),
          imageUrl: editingProduct.imageUrl,
        }
      : initialProductFormState
  );

  const { addProduct, products, setProducts } = useProduct();
  const { modifyProduct } = useProductItem((editingProduct != null) ? editingProduct.id : 1);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = formState.name;
    const description = formState.description;
    const price = parseInt(formState.price, 10);
    const stock = parseInt(formState.stock, 10);
    const imageUrl = formState.imageUrl;

    if (name.length < 2 || name.length > 100) {
      alert("상품명은 2자 이상 100자 이하로 입력해주세요.");
      nameInputRef.current?.focus();
      return;
    }

    if (description.length < 2 || description.length > 500) {
      alert("상품 설명은 2자 이상 500자 이하로 입력해주세요.");
      descriptionInputRef.current?.focus();
      return;
    }

    if (isNaN(price) ) {
      alert("상품 가격은 숫자로만 입력해주세요.");
      priceInputRef.current?.focus();
      return;
    }

    if (price < 100 || price > 1000000) {
      alert("상품 가격은 100원 이상 1,000,000원 이하로 입력해주세요.");
      priceInputRef.current?.focus();
      return;
    }

    if (isNaN(stock) ) {
      alert("상품 재고는 숫자로만 입력해주세요.");
      stockInputRef.current?.focus();
      return;
    }

    if (stock < 1 || stock > 10000) {
      alert("상품 재고는 1 이상 10000 이하로 입력해주세요.");
      stockInputRef.current?.focus();
      return;
    }

    if (imageUrl.length <= 0) {
      alert("상품 이미지 URL을 입력해주세요.");
      urlInputRef.current?.focus();
      return;
    }

    if (editingProduct) {
      modifyProduct({name, price, description, stock, imageUrl, onSuccess: (res) => {
        alert(res.msg);
        if(products == null) return;
        const updatedProduct = res.data;
        setProducts(products.map((product) => product.id === updatedProduct.id ? updatedProduct : product));
      }});
    } else {
      addProduct({name, price, description, stock, imageUrl, onSuccess: (res) => {
        alert(res.msg);
        if(products == null) return;
        setProducts([...products, res.data]);
      }});
    }

    onSubmit();
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6 mb-6 p-6 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">
          {editingProduct ? '상품 정보 수정' : '새 상품 정보 입력'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
            <input type="text" name="name" id="name" ref={nameInputRef}
              value={formState.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">가격 (원)</label>
            <input type="number" name="price" id="price" ref={priceInputRef}
              value={formState.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">재고</label>
            <input type="number" name="stock" id="stock" ref={stockInputRef}
              value={formState.stock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">상품 이미지 URL</label>
            <input type="text" name="imageUrl" id="imageUrl" placeholder="https://example.com/image.png" ref={urlInputRef}
              value={formState.imageUrl}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">상품 설명</label>
            <textarea
              name="description" id="description" rows={3} ref={descriptionInputRef}
              value={formState.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            {editingProduct ? '수정 완료' : '저장'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
            취소
          </button>
        </div>
      </form>
    </>
  );
}

function ProductList({ onEditClick }: { onEditClick: (product: Product) => void }) {
  const { products } = useProduct();
  
  return (
    <>
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
            {products?.map(product => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap">{product.id}</td>
                <td className="py-3 px-6 text-left">{product.name}</td>
                <td className="py-3 px-6 text-left">{product.price}원</td>
                <td className="py-3 px-6 text-left">{product.stock}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => onEditClick(product)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2 cursor-pointer"
                  >
                    수정
                  </button>
                  <DeleteButton productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DeleteButton({ productId }: { productId: number }) {
  const { deleteProduct } = useProductItem(productId);
  const { products, setProducts } = useProduct();

  const handleDelete = () => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      deleteProduct((res) => {
        alert(res.msg);
        if(products == null) return;
        setProducts(products.filter((product) => product.id ! == productId));
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs cursor-pointer"
    >
      삭제
    </button>
  );
}

export default function ProductManagement() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmitSuccess = () => {
    setEditingProduct(null);
    setShowForm(false);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">상품 관리</h2>

        {showForm && (
          <ProductForm
            editingProduct={editingProduct}
            onCancel={handleCancel}
            onSubmit={handleSubmitSuccess}
          />
        )}

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-700">상품 목록</h3>
            <button
              onClick={handleAddNewClick}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              새 상품 추가
            </button>
          </div>

          <ProductList onEditClick={handleEditClick} />
        </section>
      </div>
    </main>
  );
}
