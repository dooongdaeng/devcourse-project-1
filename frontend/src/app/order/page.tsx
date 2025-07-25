"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useProduct, ProductsProvider } from '@/context/ProductsContext';
import { components } from '@/lib/backend/apiV1/schema';
import { useCreateOrder, CreateOrderRequest } from '@/context/OrderContext';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import {getUserId} from "@/util/auth";
import {useWishListContext, WishListProvider} from "@/context/WishListContext";

export default function OrderWrapper() {
  const router = useRouter();
  const userId = getUserId();

  useEffect(() => {
    if (!userId) {
      router.replace('/order/guest')
    }
  }, [userId, router]);

  if(!userId) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
          <div>로딩 중..</div>
        </div>
    );
  }
  return (
          <WishListProvider userId={userId}>
            <ProductsProvider>
              <Order />
            </ProductsProvider>
          </WishListProvider>
  );
}

type Product = components['schemas']['ProductWithImageUrlDto'];

// Define a type for cart items, which includes quantity
type CartItem = Product & {
  quantity: number;
};

type PaymentInfo = {
  address: string;
  paymentMethod: 'CARD' | 'TRANSFER';
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
  const { products } = useProduct();

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
  const {handleAddToCart} = cartState;

  return (
    <>
      <li className="flex items-center mt-3 p-2 border-b border-gray-200">
        <div className="w-1/5 md:w-1/6 flex-shrink-0">
          <img className="w-14 h-14 object-cover rounded" src={product.imageUrl} alt={product.name} />
        </div>
        <Link href={`/products/detail/${product.id}`} className="flex-grow ml-4 w-0 flex-grow cursor-pointer">
          <div className="font-semibold">{product.name}</div>
        </Link>
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
  const { products } = useProduct();
  const {wishLists, isLoading} = useWishListContext();

  const { favoriteProducts } = useProducts(); // 전역 상품 목록과 찜 목록 가져오기

  if(products == null) return <div>로딩 중...</div>
  const favoritedProductsList = wishLists
      .map(wishItem => products.find(product => product.id === wishItem.productId))
      .filter(Boolean) as Product[];

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
  const { handleAddToCart } = cartState;
  const {deleteWishList} = useWishListContext();

  const handleAddToCartAndRemoveFromWishList = async () => {
    try {
      handleAddToCart(item);
      await deleteWishList(item.id);
    } catch (error) {
      console.error('찜목록에서 제거 실패:', error);
    }
  };

  return (
    <>
      <li key={item.id} className="flex items-center mt-3 p-2 border-b border-gray-200">
        <div className="w-1/5 md:w-1/6 flex-shrink-0">
          <img className="w-14 h-14 object-cover rounded" src={item.imageUrl} alt={item.name} />
        </div>
        <div className="flex-grow ml-4 w-0 flex-grow">
          <div className="font-semibold">{item.name}</div>
        </div>
        <div className="text-center font-medium w-1/5 md:w-1/6">{item.price.toLocaleString()}원</div>
        <div className="text-right w-1/5 md:w-1/6">
          <button
            onClick={handleAddToCartAndRemoveFromWishList}
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

function PaymentPopup({ 
  isOpen, 
  onClose, 
  onConfirm, 
  totalPrice 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentInfo: PaymentInfo) => void;
  totalPrice: number;
}) {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER'>('CARD');
  const [errors, setErrors] = useState<{address?: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    const newErrors: {address?: string} = {};
    if (!address.trim()) {
      newErrors.address = '배송 주소를 입력해주세요.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 결제 정보 전달
    onConfirm({
      address: address.trim(),
      paymentMethod
    });
  };

  const handleClose = () => {
    setAddress('');
    setPaymentMethod('CARD');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">결제 정보 입력</h3>
        
        <form onSubmit={handleSubmit}>
          {/* 배송 주소 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배송 주소 *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              rows={3}
              placeholder="예: 서울시 강남구 테헤란로 123, 456호"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* 결제 방법 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              결제 방법 *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'CARD')}
                  className="mr-2"
                />
                신용카드
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="TRANSFER"
                  checked={paymentMethod === 'TRANSFER'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'TRANSFER')}
                  className="mr-2"
                />
                계좌이체
              </label>
            </div>
          </div>

          {/* 총 금액 표시 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">총 결제 금액</span>
              <span className="text-xl font-bold">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-800 text-white rounded-md hover:bg-blue-950 cursor-pointer"
            >
              결제하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CheckOut({cartState} : {cartState: ReturnType<typeof useCart>}) {
  const { cartItems, setCartItems } = cartState;
  const router = useRouter();
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const { processCompleteOrder, isLoading, error } = useCreateOrder();
  const { user } = useUser();

  // Calculate total price dynamically
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Function to handle the checkout process
  const handleCheckout = async () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      if (cartItems.length === 0) {
        alert('장바구니가 비어있습니다.');
        return;
      }
      
      // 결제 팝업 열기
      setShowPaymentPopup(true);
    } else {
      alert('로그인을 해야합니다.');
      router.push('/login');
    }
  };

  // 결제 정보 확인 후 실제 결제 처리
  const handlePaymentConfirm = async (paymentInfo: PaymentInfo) => {
    try {
      // 사용자 ID를 Context에서 가져오기
      const userId = user?.id;
      if (!userId) {
        alert('로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
        router.push('/login');
        return;
      }
      
      // 주문 데이터 생성 (주소와 결제 방법 포함)
      const orderData: CreateOrderRequest = {
        orderCount: cartItems.length,
        totalPrice: totalPrice,
        paymentMethod: paymentInfo.paymentMethod,
        paymentStatus: 'PENDING',
        userId: userId,
        address: paymentInfo.address // 주소 추가
      };

      // 백엔드 API를 통한 주문 생성
      const result = await processCompleteOrder(orderData, cartItems);
      
      // 장바구니 비우기
      setCartItems([]);
      
      // 팝업 닫기
      setShowPaymentPopup(false);
      
      alert('결제가 완료되었습니다. 주문 내역에서 확인해주세요.');
      router.push('/orderHistory');
      
    } catch (error) {
      console.error('주문 처리 중 오류:', error);
      alert(`결제 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center pt-4 pb-2 border-t border-gray-300">
        <h5 className="text-lg font-bold">총금액</h5>
        <h5 className="text-lg font-bold">{totalPrice.toLocaleString()}원</h5>
      </div>
      {error && (
        <div className="text-red-500 text-sm mb-2">
          오류: {error}
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`w-full py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer ${
          isLoading 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-blue-800 text-white hover:bg-blue-950'
        }`}
      >
        {isLoading ? '결제 처리 중...' : '결제하기'}
      </button>

      {/* 결제 팝업 */}
      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        onConfirm={handlePaymentConfirm}
        totalPrice={totalPrice}
      />
    </>
  );
}

export function Order() {
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


