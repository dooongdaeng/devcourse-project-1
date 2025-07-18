"use client";

import { useState, useEffect } from 'react';
import { useCreateOrder, OrderDisplayData, OrderItemDisplayData } from '@/context/OrderContext';

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getAllOrdersForDisplay } = useCreateOrder();

  // 페이지 로드 시 주문 목록 가져오기
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const ordersData = await getAllOrdersForDisplay();
      setOrders(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '주문 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">주문 관리</h2>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-700">주문 목록</h3>
            <button
              onClick={loadOrders}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50"
            >
              {isLoading ? '로딩 중...' : '새로고침'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">주문 목록을 불러오는 중...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">주문 내역이 없습니다.</div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onOrderUpdate={loadOrders}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function OrderCard({ order, onOrderUpdate }: { 
  order: OrderDisplayData; 
  onOrderUpdate: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-md p-6 bg-gray-50">
      {/* 주문 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h4 className="text-xl font-semibold text-gray-700">주문 번호: {order.id}</h4>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {order.status}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">주문일: {order.date}</span>
          <span className="text-gray-600">고객: {order.userName}</span>
        </div>
      </div>

      {/* 주문 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <span className="text-sm text-gray-500">결제 방법</span>
          <p className="font-medium">{order.paymentMethod}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">주문 수량</span>
          <p className="font-medium">
            {order.items.reduce((total, item) => total + item.quantity, 0)}개
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-500">총 결제 금액</span>
          <p className="font-medium text-lg">
            {order.items.reduce((total, item) => total + item.totalPrice, 0).toLocaleString()}원
          </p>
        </div>
      </div>

      {/* 배송지 */}
      <div className="mb-4">
        <span className="text-sm text-gray-500">배송지</span>
        <p className="font-medium">{order.address}</p>
      </div>

      {/* 주문 아이템 토글 버튼 */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-700 font-medium text-sm"
        >
          주문 상품 {isExpanded ? '숨기기' : '보기'} ({order.items.length}개)
        </button>
        
        <div className="flex space-x-2">
          <OrderActions order={order} onOrderUpdate={onOrderUpdate} />
        </div>
      </div>

      {/* 주문 아이템 목록 */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <OrderItemsList items={order.items} order={order} onOrderUpdate={onOrderUpdate} />
        </div>
      )}
    </div>
  );
}

function OrderActions({ order, onOrderUpdate }: { 
  order: OrderDisplayData; 
  onOrderUpdate: () => void;
}) {
  const { updateOrder, deleteOrder, mapDisplayStatusToPaymentStatus } = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStatusUpdate = async () => {
    try {
      setIsProcessing(true);
      const newStatus = order.status === '처리중' ? '완료' : '처리중';
      
      await updateOrder(order.id, {
        orderCount: order.orderCount,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: mapDisplayStatusToPaymentStatus(newStatus),
        address: order.address
      });
      
      alert('주문 상태가 업데이트되었습니다.');
      onOrderUpdate();
    } catch (error) {
      alert('상태 업데이트에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 주문을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsProcessing(true);
      await deleteOrder(order.id);
      alert('주문이 삭제되었습니다.');
      onOrderUpdate();
    } catch (error) {
      alert('주문 삭제에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {order.status === '처리중' && (
        <button
          onClick={handleStatusUpdate}
          disabled={isProcessing}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm cursor-pointer disabled:opacity-50"
        >
          처리 완료
        </button>
      )}
      
      {order.status === '처리중' && (
        <button
          onClick={handleDelete}
          disabled={isProcessing}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm cursor-pointer disabled:opacity-50"
        >
          주문 삭제
        </button>
      )}
    </>
  );
}

function OrderItemsList({ items, onOrderUpdate, order }: { 
  items: OrderItemDisplayData[]; 
  onOrderUpdate: () => void;
  order: OrderDisplayData;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-2 px-4 text-left">상품 ID</th>
            <th className="py-2 px-4 text-left">상품명</th>
            <th className="py-2 px-4 text-left">단가</th>
            <th className="py-2 px-4 text-left">수량</th>
            <th className="py-2 px-4 text-left">총액</th>
            <th className="py-2 px-4 text-center">액션</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {items.map(item => (
            <OrderItemRow 
              key={item.id} 
              item={item} 
              order={order}
              onOrderUpdate={onOrderUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderItemRow({ item, onOrderUpdate, order }: { 
  item: OrderItemDisplayData; 
  onOrderUpdate: () => void;
  order: OrderDisplayData;
}) {
  const { deleteOrderItem, updateOrder, mapDisplayStatusToPaymentStatus } = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 주문 아이템을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsProcessing(true);
      await deleteOrderItem(item.id);
      
      // 아이템 삭제 후 주문 정보 업데이트
      const remainingItems = order.items.filter(i => i.id !== item.id);
      const newTotalPrice = remainingItems.reduce((total, i) => total + i.totalPrice, 0);
      const newOrderCount = remainingItems.reduce((total, i) => total + i.quantity, 0);
      
      // 주문 정보 업데이트
      await updateOrder(order.id, {
        orderCount: newOrderCount,
        totalPrice: newTotalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: mapDisplayStatusToPaymentStatus(order.status),
        address: order.address
      });
      
      alert('주문 아이템이 삭제되고 주문 정보가 업데이트되었습니다.');
      onOrderUpdate();
    } catch (error) {
      alert('주문 아이템 삭제에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-2 px-4 text-left">{item.productId}</td>
      <td className="py-2 px-4 text-left">{item.name}</td>
      <td className="py-2 px-4 text-left">{item.price.toLocaleString()}원</td>
      <td className="py-2 px-4 text-left">{item.quantity}개</td>
      <td className="py-2 px-4 text-left font-medium">{item.totalPrice.toLocaleString()}원</td>
      <td className="py-2 px-4 text-center">
        {order.status === '처리중' && (
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer disabled:opacity-50"
          >
            삭제
          </button>
        )}
      </td>
    </tr>
  );
}