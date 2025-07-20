"use client";

import { useState, useEffect } from 'react';
import { useCreateOrder, OrderDisplayData, OrderItemDisplayData } from '@/context/OrderContext';

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderDisplayData | null>(null);
  const [editingOrderItem, setEditingOrderItem] = useState<OrderItemDisplayData | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrderItemForm, setShowOrderItemForm] = useState(false);

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

  const handleEditOrder = (order: OrderDisplayData) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  const handleEditOrderItem = (item: OrderItemDisplayData) => {
    setEditingOrderItem(item);
    setShowOrderItemForm(true);
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditingOrderItem(null);
    setShowOrderForm(false);
    setShowOrderItemForm(false);
  };

  const handleEditSuccess = () => {
    setEditingOrder(null);
    setEditingOrderItem(null);
    setShowOrderForm(false);
    setShowOrderItemForm(false);
    loadOrders();
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
                  onEditOrder={handleEditOrder}
                  onEditOrderItem={handleEditOrderItem}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 주문 수정 모달 */}
      {showOrderForm && editingOrder && (
        <Modal onClose={handleCancelEdit}>
          <OrderEditForm
            order={editingOrder}
            onCancel={handleCancelEdit}
            onSuccess={handleEditSuccess}
          />
        </Modal>
      )}

      {/* 주문 아이템 수정 모달 */}
      {showOrderItemForm && editingOrderItem && (
        <Modal onClose={handleCancelEdit}>
          <OrderItemEditForm
            orderItem={editingOrderItem}
            onCancel={handleCancelEdit}
            onSuccess={handleEditSuccess}
          />
        </Modal>
      )}
    </main>
  );
}

function OrderCard({ order, onOrderUpdate, onEditOrder, onEditOrderItem }: { 
  order: OrderDisplayData; 
  onOrderUpdate: () => void;
  onEditOrder: (order: OrderDisplayData) => void;
  onEditOrderItem: (item: OrderItemDisplayData) => void;
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
          {order.status === '처리중' && (
            <button
              onClick={() => onEditOrder(order)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm cursor-pointer"
            >
              주문 수정
            </button>
          )}
        </div>
      </div>

      {/* 주문 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <span className="text-sm text-gray-500">결제 방법</span>
          <p className="font-medium text-lg text-gray-700">{order.paymentMethod}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">주문 수량</span>
          <p className="font-medium text-lg text-gray-700">
            {order.items.reduce((total, item) => total + item.quantity, 0)}개
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-500">총 결제 금액</span>
          <p className="font-medium text-lg text-gray-700">
            {order.items.reduce((total, item) => total + item.totalPrice, 0).toLocaleString()}원
          </p>
        </div>
      </div>

      {/* 배송지 */}
      <div className="mb-4">
        <span className="text-sm text-gray-500">배송지</span>
        <p className="font-medium text-lg text-gray-700">{order.address}</p>
      </div>

      {/* 주문 아이템 토글 버튼 */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-700 font-medium text-sm cursor-pointer"
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
          <OrderItemsList items={order.items} order={order} onOrderUpdate={onOrderUpdate} onEditOrderItem={onEditOrderItem} />
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

function OrderItemsList({ items, onOrderUpdate, order, onEditOrderItem }: { 
  items: OrderItemDisplayData[]; 
  onOrderUpdate: () => void;
  order: OrderDisplayData;
  onEditOrderItem: (item: OrderItemDisplayData) => void;
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
              onEditOrderItem={onEditOrderItem}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderItemRow({ item, onOrderUpdate, order, onEditOrderItem }: { 
  item: OrderItemDisplayData; 
  onOrderUpdate: () => void;
  order: OrderDisplayData;
  onEditOrderItem: (item: OrderItemDisplayData) => void;
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
          <div className="flex space-x-1 justify-center">
            <button
              onClick={() => onEditOrderItem(item)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs cursor-pointer disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

// 모달 컴포넌트
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">수정</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// 주문 수정 폼 컴포넌트
function OrderEditForm({ order, onCancel, onSuccess }: {
  order: OrderDisplayData;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const { updateOrder, mapDisplayStatusToPaymentStatus } = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    orderCount: order.orderCount.toString(),
    totalPrice: order.totalPrice.toString(),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.status,
    address: order.address
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderCount = parseInt(formData.orderCount);
    const totalPrice = parseInt(formData.totalPrice);

    if (isNaN(orderCount) || orderCount <= 0) {
      alert('주문 수량은 1 이상의 숫자여야 합니다.');
      return;
    }

    if (isNaN(totalPrice) || totalPrice <= 0) {
      alert('총 금액은 1 이상의 숫자여야 합니다.');
      return;
    }

    if (!formData.address.trim()) {
      alert('배송지를 입력해주세요.');
      return;
    }

    try {
      setIsProcessing(true);
      await updateOrder(order.id, {
        orderCount,
        totalPrice,
        paymentMethod: formData.paymentMethod,
        paymentStatus: mapDisplayStatusToPaymentStatus(formData.paymentStatus),
        address: formData.address
      });
      alert('주문이 수정되었습니다.');
      onSuccess();
    } catch (error) {
      alert('주문 수정에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="text-xl font-semibold text-gray-700">주문 정보 수정 (주문 번호: {order.id})</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">주문 수량</label>
          <input 
            type="number" 
            value={formData.orderCount}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">총 금액 (원)</label>
          <input 
            type="number" 
            value={formData.totalPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, totalPrice: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">결제 방법</label>
          <input 
            type="text" 
            value={formData.paymentMethod}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">주문 상태</label>
          <select 
            value={formData.paymentStatus}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          >
            <option value="처리중">처리중</option>
            <option value="완료">완료</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">배송지</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            rows={2}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button 
          type="submit" 
          disabled={isProcessing}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? '수정 중...' : '수정 완료'}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          취소
        </button>
      </div>
    </form>
  );
}

// 주문 아이템 수정 폼 컴포넌트
function OrderItemEditForm({ orderItem, onCancel, onSuccess }: {
  orderItem: OrderItemDisplayData;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const { updateOrderItem } = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    quantity: orderItem.quantity.toString(),
    unitPrice: orderItem.price.toString(),
    productId: orderItem.productId.toString()
  });

      const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const quantity = parseInt(formData.quantity);
    const unitPrice = parseInt(formData.unitPrice);
    const productId = parseInt(formData.productId); // 수정하지 않지만 기존 값 유지

    if (isNaN(quantity) || quantity <= 0) {
      alert('수량은 1 이상의 숫자여야 합니다.');
      return;
    }

    if (isNaN(unitPrice) || unitPrice <= 0) {
      alert('단가는 1 이상의 숫자여야 합니다.');
      return;
    }

    try {
      setIsProcessing(true);
      await updateOrderItem(orderItem.id, {
        quantity,
        unitPrice,
        productId // 기존 값 그대로 전송
      });
      alert('주문 아이템이 수정되었습니다.');
      onSuccess();
    } catch (error) {
      alert('주문 아이템 수정에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="text-xl font-semibold text-gray-700">주문 아이템 수정 (아이템 ID: {orderItem.id})</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">상품 ID</label>
          <input 
            type="number" 
            value={formData.productId}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">상품 ID는 수정할 수 없습니다</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">수량</label>
          <input 
            type="number" 
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">단가 (원)</label>
          <input 
            type="number" 
            value={formData.unitPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      </div>
      <div className="p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm text-gray-600">
          <strong>계산된 총액:</strong> {(parseInt(formData.quantity) * parseInt(formData.unitPrice) || 0).toLocaleString()}원
        </p>
      </div>
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button 
          type="submit" 
          disabled={isProcessing}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? '수정 중...' : '수정 완료'}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          취소
        </button>
      </div>
    </form>
  );
}