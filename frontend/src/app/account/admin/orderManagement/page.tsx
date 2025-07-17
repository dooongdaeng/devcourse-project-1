"use client";

import { useProducts } from '@/context/ProductContext';

export default function OrderManagement() {
  const { orderHistory, cancelOrder, updateOrderStatus } = useProducts();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">주문 관리</h2>

        {orderHistory.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">주문 내역이 없습니다.</p>
        ) : (
          <div className="space-y-8">
            {orderHistory.map(order => (
              <div key={order.id} className="border border-gray-200 rounded-md p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-700">주문 번호: {order.id}</h3>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-4">주문일: {order.date}</span>
                    <span className="text-gray-600">상태: {order.status}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.productId} className="flex items-center border-b border-gray-100 pb-3">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">{parseInt(item.price).toLocaleString()}원 x {item.quantity}개</p>
                      </div>
                      <span className="font-semibold text-gray-800">{(parseInt(item.price) * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center pt-4 mt-4 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800">총 결제 금액: {order.totalPrice.toLocaleString()}원</h4>
                  {order.status === '처리중' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, '배송중')}
                      className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
                    >
                      처리 완료
                    </button>
                  )}
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
                  >
                    주문 취소
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}