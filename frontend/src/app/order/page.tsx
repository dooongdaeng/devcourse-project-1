"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define a type for our product items for better type-safety
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
};

// Define a type for cart items, which includes quantity
type CartItem = Product & {
  quantity: number;
};

export default function Order() {
  const router = useRouter();

  // Initial data for products and wishlist
  const initialProducts: Product[] = [
    { id: 1, name: 'Columbia Nariñó', category: '커피콩', price: 5000, imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg' },
    { id: 2, name: 'Brazil Serra Do Caparaó', category: '커피콩', price: 6000, imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg' },
    { id: 3, name: 'Ethiopia Yirgacheffe', category: '커피콩', price: 7000, imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg' },
  ];

  const initialWishlist: Product[] = [
    { id: 4, name: 'Favorite Blend A', category: '찜한 커피콩', price: 8000, imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg' },
    { id: 5, name: 'Favorite Blend B', category: '찜한 커피콩', price: 9500, imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg' },
  ];
  
  const initialCart: CartItem[] = [
      { id: 1, name: 'Columbia Nariñó', category: '커피콩', price: 5000, imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg', quantity: 2 },
      { id: 2, name: 'Brazil Serra Do Caparaó', category: '커피콩', price: 6000, imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg', quantity: 1 },
      { id: 3, name: 'Ethiopia Yirgacheffe', category: '커피콩', price: 7000, imageUrl: 'https://i.imgur.com/HKOFQYa.jpeg', quantity: 1 },
  ]

  // State management for products, wishlist, and cart
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [wishlistItems, setWishlistItems] = useState<Product[]>(initialWishlist);
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  // Function to add items to the cart
  const handleAddToCart = (productToAdd: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productToAdd.id);
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map(item =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If item doesn't exist, add it to the cart with quantity 1
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  // Function to update item quantity in the cart
  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      // If quantity is less than 1, remove the item
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Function to remove items from the cart
  const handleRemoveFromCart = (productIdToRemove: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productIdToRemove));
  };

  // Function to handle the checkout process
  const handleCheckout = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      alert('결제를 진행합니다.');
      // Proceed with actual checkout logic
    } else {
      alert('로그인을 해야합니다.');
      router.push('/login');
    }
  };

  // Calculate total price dynamically
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row text-gray-700">
          {/* Product List Section */}
          <div className="md:w-2/3 p-4 md:p-6 flex flex-col items-start">
            <h5 className="text-2xl font-bold mb-4">상품 목록</h5>
            <ul className="w-full">
              {products.map(product => (
                <li key={product.id} className="flex items-center mt-3 p-2 border-b border-gray-200">
                  <div className="w-1/5 md:w-1/6 flex-shrink-0">
                    <img className="w-14 h-14 object-cover rounded" src={product.imageUrl} alt={product.name} />
                  </div>
                  <div className="flex-grow ml-4">
                    <div className="text-sm text-gray-500">{product.category}</div>
                    <div className="font-semibold">{product.name}</div>
                  </div>
                  <div className="text-center font-medium w-1/5 md:w-1/6">{product.price.toLocaleString()}원</div>
                  <div className="text-right w-1/5 md:w-1/6">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-3 py-1 border border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white text-sm cursor-pointer"
                    >
                      추가
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {/* Wishlist Section */}
            <div className="mt-8 w-full flex flex-col items-start">
              <h5 className="text-2xl font-bold mb-4">찜목록</h5>
              <ul className="w-full">
                {wishlistItems.map(item => (
                  <li key={item.id} className="flex items-center mt-3 p-2 border-b border-gray-200">
                    <div className="w-1/5 md:w-1/6 flex-shrink-0">
                      <img className="w-14 h-14 object-cover rounded" src={item.imageUrl} alt={item.name} />
                    </div>
                    <div className="flex-grow ml-4">
                      <div className="text-sm text-gray-500">{item.category}</div>
                      <div className="font-semibold">{item.name}</div>
                    </div>
                    <div className="text-center font-medium w-1/5 md:w-1/6">{item.price.toLocaleString()}원</div>
                    <div className="text-right w-1/5 md:w-1/6">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-3 py-1 border border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white text-sm cursor-pointer"
                      >
                        추가
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Summary Section */}
          <div className="md:w-1/3 bg-gray-100 p-4 md:p-6 rounded-b-xl md:rounded-r-xl md:rounded-bl-none text-gray-700 flex flex-col">
            <h5 className="text-2xl font-bold mb-4">장바구니</h5>
            <hr className="my-4 border-gray-300" />

            {/* Order Items */}
            <div className="mb-4 flex-grow">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">장바구니가 비어있습니다.</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span className="text-base truncate pr-2">{item.name}</span>
                    <div className="flex items-center">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 border rounded">-</button>
                      <span className="px-3">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
                      <button onClick={() => handleRemoveFromCart(item.id)} className="ml-3 text-red-500 hover:text-red-700 text-sm">삭제</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Section */}
            <div>
              {/* Notice */}
              <div className="space-y-4 mb-4">
                <p className="text-sm text-gray-600">당일 오후 2시 이후의 주문은 다음날 배송을 시작합니다.</p>
              </div>

              {/* Total and Checkout */}
              <div className="flex justify-between items-center pt-4 pb-2 border-t border-gray-300">
                <h5 className="text-lg font-bold">총금액</h5>
                <h5 className="text-lg font-bold">{totalPrice.toLocaleString()}원</h5>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

