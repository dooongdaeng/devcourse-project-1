"use client";

import { createContext, useState, useContext, ReactNode, ChangeEvent } from 'react';

// 상품 데이터 타입 정의
export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
};

// Context가 제공할 값들의 타입 정의
type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
};

// Context 생성 (초기값은 undefined)
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// 다른 컴포넌트에서 쉽게 Context를 사용하기 위한 커스텀 훅
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Context Provider 컴포넌트
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const initialProducts: Product[] = [
    { id: 101, name: '콜롬비아 나리뇨', price: '5000', stock: 100, description: '신선한 콜롬비아 원두입니다.', imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg' },
    { id: 102, name: '브라질 세하도', price: '6000', stock: 150, description: '고소한 브라질 원두입니다.', imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg' },
  ];

  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    setProducts(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 101;
      const newProduct: Product = {
        id: newId,
        ...productData,
        imageUrl: productData.imageUrl || 'https://i.imgur.com/HKOFQYa.jpeg', // 기본 이미지
      };
      return [...prev, newProduct];
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
