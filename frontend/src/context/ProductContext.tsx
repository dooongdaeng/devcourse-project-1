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
  userId: string;
  password: string;
  name: string;
  postalCode: string;
  address: string;
  signupDate: string;
  role: 'admin' | 'user';
};

export type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

export type Order = {
  id: number;
  date: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
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
  cancelOrder: (orderId: number) => void;
  updateOrderStatus: (orderId: number, newStatus: string) => void;
  currentUser: User | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
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
    { id: 1, userId: 'user1', password: '123', name: '김철수', postalCode: '01234', address: '서울시 강남구 테헤란로 123', signupDate: '2023-01-15', role: 'user' },
    { id: 2, userId: 'user2', password: '123', name: '이영희', postalCode: '56789', address: '부산시 해운대구 센텀중앙로 99', signupDate: '2023-03-20', role: 'user' },
    { id: 3, userId: 'admin', password: 'admin', name: '관리자', postalCode: '-', address: '-', signupDate: '2023-01-01', role: 'admin' },
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

  const addUser = (userData: Omit<User, 'id' | 'signupDate' | 'role'>) => {
    setUsers(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(u => u.id)) + 1 : 1;
      const today = new Date();
      const signupDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      const newUser: User = {
        id: newId,
        ...userData,
        signupDate,
        role: 'user',
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
        status: '처리중',
      };
      return [...prev, newOrder];
    });
  };

  const cancelOrder = (orderId: number) => {
    setOrderHistory(prev => prev.filter(order => order.id !== orderId));
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrderHistory(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = sessionStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const login = (userId: string, password: string): boolean => {
    const user = users.find(u => u.userId === userId && u.password === password);
    if (user) {
      setCurrentUser(user);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('currentUser');
    }
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
    cancelOrder,
    updateOrderStatus,
    currentUser,
    login,
    logout,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
