"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// 상품 데이터 타입 정의
export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  postalCode: string;
  address: string;
  signupDate: string;
};

export type OrderItem = {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
};

export type Order = {
  id: number;
  date: string;
  items: OrderItem[];
  totalPrice: number;
};

// Context가 제공할 값들의 타입 정의
type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
  favoriteProducts: { [key: number]: boolean };
  toggleFavorite: (productId: number) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'signupDate'>) => void;
  deleteUser: (userId: number) => void;
  orderHistory: Order[];
  addOrder: (items: OrderItem[], totalPrice: number) => void;
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
    { id: 103, name: '에티오피아 예가체프', price: '6000', stock: 120, description: '달콤한 에티오피아 원두입니다.', imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg' },
    { id: 104, name: '에티오피아 게이샤', price: '8000', stock: 80, description: '감미로운 에티오피아 원두입니다.', imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg' }
  ];

  const initialUsers: User[] = [
    { id: 1, email: 'user1@example.com', name: '김철수', postalCode: '01234', address: '서울시 강남구 테헤란로 123', signupDate: '2023-01-15' },
    { id: 2, email: 'user2@example.com', name: '이영희', postalCode: '56789', address: '부산시 해운대구 센텀중앙로 99', signupDate: '2023-03-20' },
  ];

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const savedProducts = sessionStorage.getItem('products');
      return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    }
    return initialProducts;
  });

  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const savedUsers = sessionStorage.getItem('users');
      return savedUsers ? JSON.parse(savedUsers) : initialUsers;
    }
    return initialUsers;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const [favoriteProducts, setFavoriteProducts] = useState<{ [key: number]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = sessionStorage.getItem('favoriteProducts');
      return savedFavorites ? JSON.parse(savedFavorites) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
    }
  }, [favoriteProducts]);

  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const savedOrderHistory = sessionStorage.getItem('orderHistory');
      return savedOrderHistory ? JSON.parse(savedOrderHistory) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    }
  }, [orderHistory]);

  const toggleFavorite = (productId: number) => {
    setFavoriteProducts(prevFavorites => ({
      ...prevFavorites,
      [productId]: !prevFavorites[productId]
    }));
  };

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

  const addUser = (userData: Omit<User, 'id' | 'signupDate'>) => {
    setUsers(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(u => u.id)) + 1 : 1;
      const today = new Date();
      const signupDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      const newUser: User = {
        id: newId,
        ...userData,
        signupDate,
      };
      return [...prev, newUser];
    });
  };

  const deleteUser = (userId: number) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const addOrder = (items: OrderItem[], totalPrice: number) => {
    setOrderHistory(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(o => o.id)) + 1 : 1;
      const today = new Date();
      const orderDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      const newOrder: Order = {
        id: newId,
        date: orderDate,
        items,
        totalPrice,
      };
      return [...prev, newOrder];
    });
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    favoriteProducts,
    toggleFavorite,
    users,
    addUser,
    deleteUser,
    orderHistory,
    addOrder,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
