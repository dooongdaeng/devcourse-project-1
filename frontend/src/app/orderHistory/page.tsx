"use client";

import { useProducts } from '@/context/ProductContext';
import { useCreateOrder } from '@/context/OrderContext';
import { useEffect, useState } from 'react';
import { apiFetch } from "@/lib/backend/client";
import Link from 'next/link';

// 상품 타입 정의
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  createDate?: string;
  modifyDate?: string;
}

// RsData 타입 정의 (필요한 경우)
interface RsData<T = unknown> {
  resultCode: string;
  msg: string;
  data?: T;
}

// 타입 가드 함수
const isRsDataFormat = (res: any): res is RsData<any> => {
  return res && typeof res === 'object' && 'resultCode' in res && 'msg' in res;
};

export default function OrderHistory() {
  const { orderHistory } = useProducts();
  const { getMyOrders, getOrderItems, updateMyOrder, deleteMyOrder, orders, isLoading, error } = useCreateOrder();
  
  // 팝업 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [productNames, setProductNames] = useState<{ [key: number]: string }>({});
  const [itemsLoading, setItemsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState({ address: '', paymentMethod: 'CARD' });

  // 컴포넌트 마운트 시 주문 목록 조회
  useEffect(() => {
    getMyOrders();
  }, []);

  // 주문 아이템이 로드되면 각 상품의 이름을 가져옴
  useEffect(() => {
    if (orderItems.length > 0) {
      const fetchNames = async () => {
        const names: { [key: number]: string } = {};
        for (const item of orderItems) {
          if (!productNames[item.productId]) { // 이미 가져온 상품명은 다시 가져오지 않음
            try {
              // /api/v1/products/{id} 엔드포인트 호출
              const response: any = await apiFetch(`/api/v1/products/${item.productId}`);
              
              // 응답 형식에 따라 처리
              let productName = '알 수 없는 상품';
              
              if (response) {
                // 직접 Product 객체인 경우
                if ('name' in response && typeof response.name === 'string') {
                  productName = response.name;
                }
                // RsData 형식인 경우
                else if (isRsDataFormat(response) && response.data && 'name' in response.data) {
                  productName = response.data.name;
                }
              }
              
              names[item.productId] = productName;
            } catch (err) {
              console.error(`상품 ID ${item.productId}의 이름을 가져오지 못했습니다:`, err);
              names[item.productId] = '알 수 없는 상품'; // 에러 발생 시 대체 텍스트
            }
          } else {
            names[item.productId] = productNames[item.productId]; // 이미 있는 상품명 사용
          }
        }
        setProductNames(prevNames => ({ ...prevNames, ...names }));
      };
      fetchNames();
    }
  }, [orderItems]); // orderItems가 변경될 때마다 실행

  // 주문 클릭 핸들러
  const handleOrderClick = async (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsPopupOpen(true);
    setItemsLoading(true);
    
    try {
      const items = await getOrderItems(orderId);
      setOrderItems(items || []);
    } catch (error) {
      console.error('주문 아이템 조회 실패:', error);
      setOrderItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  // 팝업 닫기 핸들러
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrderId(null);
    setOrderItems([]);
  };

  // 수정 버튼 클릭 시
  const handleEditClick = (order: any) => {
    setEditOrder(order);
    setEditForm({ address: order.address, paymentMethod: order.paymentMethod });
    setEditModalOpen(true);
  };

  // 수정 모달에서 저장
  const handleEditSave = async () => {
    if (!editOrder) return;
    try {
      await updateMyOrder(editOrder.id, {
        orderCount: editOrder.orderCount,
        totalPrice: editOrder.totalPrice,
        paymentStatus: editOrder.paymentStatus,
        address: editForm.address,
        paymentMethod: editForm.paymentMethod,
      });
      alert('주문 정보가 수정되었습니다.');
      setEditModalOpen(false);
      setEditOrder(null);
      await getMyOrders();
    } catch (err) {
      alert('주문 정보 수정에 실패했습니다.');
    }
  };

  // 삭제(취소) 버튼 클릭 시
  const handleDeleteClick = async (orderId?: number) => {
    if (!orderId) return;
    if (!window.confirm('정말로 이 주문을 취소하시겠습니까?')) return;
    try {
      await deleteMyOrder(orderId);
      alert('주문이 취소되었습니다.');
      await getMyOrders();
    } catch (err) {
      alert('주문 취소에 실패했습니다.');
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '정보 없음';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

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
              <div 
                key={order.id} 
                className="border border-gray-200 rounded-md p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleOrderClick(order.id ?? 0)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">주문 번호: #{order.id ?? 0}</h3>
                    <p className="text-gray-600">주문일: {formatDate(order.createDate)}</p>
                    <p className="text-sm text-gray-500">결제방법: {order.paymentMethod ?? '정보 없음'}</p>
                    <p className="text-sm text-gray-500">결제상태: {order.paymentStatus === 'COMPLETED' ? '완료' : '처리중'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">{(order.totalPrice ?? 0).toLocaleString()}원</p>
                    <p className="text-sm text-gray-500">{order.orderCount ?? 0}개 상품</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEditClick(order); }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm cursor-pointer"
                    disabled={!order.id}
                  >
                    주문 수정
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(order.id); }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm cursor-pointer"
                    disabled={!order.id}
                  >
                    주문 취소
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 팝업 */}
      {isPopupOpen && selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-700">주문 상세 정보 - #{selectedOrderId}</h3>
              <button 
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            {itemsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">주문 상품을 불러오는 중...</p>
              </div>
            ) : orderItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">주문 상품이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orderItems.map(item => (
                  <div key={item.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <Link 
                          href={`/products/detail/${item.productId}`} 
                          className="block cursor-pointer hover:text-blue-600 transition-colors"
                        >
                          <p className="font-medium text-lg text-bold text-gray-700">
                            상품명: {productNames[item.productId] || '로딩 중...'}
                          </p>
                        </Link>
                        <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                        <p className="text-sm text-gray-600">단가: {item.unitPrice?.toLocaleString()}원</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-700">{item.totalPrice?.toLocaleString()}원</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-700">총 합계</p>
                    <p className="text-lg font-bold text-gray-900">
                      {orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">주문 정보 수정</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">배송지</label>
              <input
                type="text"
                value={editForm.address}
                onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">결제 방법</label>
              <select
                value={editForm.paymentMethod}
                onChange={e => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="CARD">카드</option>
                <option value="TRANSFER">계좌이체</option>
              </select>
            </div>
            <div className="flex space-x-2 pt-4">
              <button
                onClick={handleEditSave}
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                저장
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}