"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts, OrderItem } from '@/context/ProductContext';
import { useProduct } from '@/context/ProductsContext';
import { useProductImage } from '@/context/ProductImageContext';
import { components } from '@/lib/backend/apiV1/schema';

type Product = components['schemas']['ProductDto'];

// Define a type for cart items, which includes quantity
type CartItem = Product & {
  quantity: number;
};

function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  
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

  return {cartItems, setCartItems, handleAddToCart, handleUpdateQuantity, handleRemoveFromCart};
}

function ProductList({cartState} : {cartState: ReturnType<typeof useCart>}) {
  const products = useProduct();

  return (
    <>
      <h5 className="text-2xl font-bold mb-4">상품 목록</h5>
      <ul className="w-full">
        {products?.map(product => (
          <ProductItem key={product.id} product={product} cartState={cartState}></ProductItem>
        ))}
      </ul>
    </>
  );
}

function ProductItem({cartState, product} : {
  cartState: ReturnType<typeof useCart>;
  product: Product;
}) {
  const productImage = useProductImage(product.id);
  const {handleAddToCart} = cartState;

  return (
    <>
      <li className="flex items-center mt-3 p-2 border-b border-gray-200">
        <div className="w-1/5 md:w-1/6 flex-shrink-0">
          <img className="w-14 h-14 object-cover rounded" src={productImage} alt={product.name} />
        </div>
        <div className="flex-grow ml-4 w-0 flex-grow">
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
    </>
  );
}

function WishList({cartState} : {cartState: ReturnType<typeof useCart>}) {
  const products = useProduct();

  const { favoriteProducts } = useProducts(); // 전역 상품 목록과 찜 목록 가져오기

  if(products == null) return <div>로딩 중...</div>
  const favoritedProductsList = products?.filter(product => favoriteProducts[product.id]);

  return (
    <>
      <div className="mt-8 w-full flex flex-col items-start">
        <h5 className="text-2xl font-bold mb-4">찜목록</h5>
        <ul className="w-full">
          {favoritedProductsList.length === 0 ? (
            <p className="text-gray-500">찜 목록이 비어있습니다.</p>
          ) : (
            favoritedProductsList.map(item => (
              <WishListItem key={item.id} item={item} cartState={cartState}></WishListItem>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

function WishListItem({cartState, item} : {
  cartState: ReturnType<typeof useCart>;
  item: Product;
}){
  const itemImage = useProductImage(item.id);
  const { handleAddToCart } = cartState;

  return (
    <>
      <li key={item.id} className="flex items-center mt-3 p-2 border-b border-gray-200">
        <div className="w-1/5 md:w-1/6 flex-shrink-0">
          <img className="w-14 h-14 object-cover rounded" src={itemImage} alt={item.name} />
        </div>
        <div className="flex-grow ml-4">
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
    </>
  );
}

function OrderList({cartState} : {cartState: ReturnType<typeof useCart>}) {
  const {cartItems, handleUpdateQuantity, handleRemoveFromCart} = cartState;

  return (
    <>
      <div className="mb-4 flex-grow">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">장바구니가 비어있습니다.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span className="text-base truncate pr-2">{item.name}</span>
              <div className="flex items-center">
                <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 border rounded hover:bg-gray-800 hover:text-white cursor-pointer">-</button>
                <span className="px-3">{item.quantity}</span>
                <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border rounded hover:bg-gray-800 hover:text-white cursor-pointer">+</button>
                <button onClick={() => handleRemoveFromCart(item.id)} className="ml-3 px-2 py-1 border border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white text-sm cursor-pointer whitespace-nowrap">삭제</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function CheckOut() {
  const { addOrder } = useProducts(); // 전역 상품 목록과 찜 목록 가져오기
  const {cartItems, setCartItems} = useCart();
  const router = useRouter();

  // Calculate total price dynamically
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Function to handle the checkout process
  const handleCheckout = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      if (window.confirm('결제를 진행합니다.')) {
        if (cartItems.length === 0) {
          alert('장바구니가 비어있습니다.');
          return;
        }

        const orderItems: OrderItem[] = cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        }));

        addOrder(orderItems, totalPrice);
        setCartItems([]); // 장바구니 비우기
        alert('결제가 완료되었습니다. 주문 내역에서 확인해주세요.');
        router.push('/orderHistory');
      }
    } else {
      alert('로그인을 해야합니다.');
      router.push('/login');
    }
  };

  return (
    <>
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
    </>
  );
}

export default function Order() {
  const cartState = useCart();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row text-gray-700">

          {/* Product List Section */}
          <div className="md:w-2/3 p-4 md:p-6 flex flex-col items-start">
            <ProductList cartState={cartState}></ProductList>
            <WishList cartState={cartState}></WishList>
          </div>

          {/* Summary Section */}
          <div className="md:w-1/3 bg-gray-100 p-4 md:p-6 rounded-b-xl md:rounded-r-xl md:rounded-bl-none text-gray-700 flex flex-col">
            <h5 className="text-2xl font-bold mb-4">장바구니</h5>
            <hr className="my-4 border-gray-300" />

            {/* Order Items */}
            <OrderList cartState={cartState}></OrderList>

            {/* Bottom Section */}
            <div>
              {/* Notice */}
              <div className="space-y-4 mb-4">
                <p className="text-sm text-gray-600">당일 오후 2시 이후의 주문은 다음날 배송을 시작합니다.</p>
              </div>

              {/* Total and Checkout */}
              <CheckOut cartState={cartState}></CheckOut>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


