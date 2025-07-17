"use client";

import { useProducts } from '@/context/ProductContext';

export default function OrderHistory() {
  const { orderHistory } = useProducts();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">주문 내역</h2>

        {orderHistory.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">주문 내역이 없습니다.</p>
        ) : (
          <div className="space-y-8">
            {orderHistory.map(order => (
              <div key={order.id} className="border border-gray-200 rounded-md p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-700">주문 번호: {order.id}</h3>
                  <span className="text-gray-600">주문일: {order.date}</span>
                </div>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.productId} className="flex items-center border-b border-gray-100 pb-3">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.price.toLocaleString()}원 x {item.quantity}개</p>
                      </div>
                      <span className="font-semibold text-gray-800">{(item.price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center pt-4 mt-4 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800">총 결제 금액: {order.totalPrice.toLocaleString()}원</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}