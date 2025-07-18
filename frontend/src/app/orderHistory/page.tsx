"use client";

import { useProducts } from '@/context/ProductContext';
import { useCreateOrder } from '@/context/OrderContext';
import { useEffect } from 'react';

export default function OrderHistory() {
  const { orderHistory } = useProducts();
  const { getMyOrders, orders, isLoading, error } = useCreateOrder();

  useEffect(() => {
    console.log('getMyOrders 호출 시작');
    getMyOrders()
      .then(result => {
        console.log('API 결과:', result);
      })
      .catch(err => {
        console.log('API 에러:', err);
      });
  }, []);

  console.log('현재 상태:', { orders, isLoading, error });

  // 로딩 중일 때
  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">주문 내역</h2>
          <p className="text-center text-gray-500 text-lg">주문 내역을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">주문 내역</h2>
          <p className="text-center text-red-500 text-lg">오류: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">주문 내역</h2>

        {!orders || orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">주문 내역이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border border-gray-200 rounded-md p-6 bg-gray-50 cursor-pointer hover:bg-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">주문 번호: #{order.id ?? 0}</h3>
                    <p className="text-gray-600">주문일: {order.createDate ?? '정보 없음'}</p>
                    <p className="text-sm text-gray-500">결제방법: {order.paymentMethod ?? '정보 없음'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">{(order.totalPrice ?? 0).toLocaleString()}원</p>
                    <p className="text-sm text-gray-500">{order.orderCount ?? 0}개 상품</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}