"use client";

import { components } from "@/lib/backend/apiV1/schema";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/backend/client";

type OrderDto = components['schemas']['OrderDto'];
type OrderItemDto = components['schemas']['OrderItemDto'];

// 기존 타입들
export type CreateOrderRequest = {
    orderCount: number;
    totalPrice: number;
    paymentMethod: string;
    paymentStatus: string;
    userId: number;
    address: string;
};

export type CreateOrderItemRequest = {
    orderId: number;
    quantity: number;
    unitPrice: number;
    productId: number;
};

// 일반 사용자용 주문 수정 타입 (userId 제외)
export type UpdateMyOrderRequest = {
    orderCount: number;
    totalPrice: number;
    paymentMethod: string;
    paymentStatus: string;
    address: string;
};

// 관리자용 주문 수정 타입
export type UpdateOrderRequest = {
    orderCount: number;
    totalPrice: number;
    paymentMethod: string;
    paymentStatus: string;
    address: string;
};

export type UpdateOrderItemRequest = {
    quantity: number;
    unitPrice: number;
    productId: number;
};

// 페이지에서 사용할 데이터 타입들
export interface OrderDisplayData {
  id: number;
  date: string;
  status: string;
  items: OrderItemDisplayData[];
  totalPrice: number;
  orderCount: number;
  paymentMethod: string;
  address: string;
  userId: number;
  userName: string;
}

export interface OrderItemDisplayData {
  id: number;
  productId: number;
  name: string;  
  price: number;  
  quantity: number;
  totalPrice: number;
}

// RsData 타입 정의 (client에서 가져올 수 없으므로 여기서 정의)
interface RsData<T = unknown> {
    resultCode: string;
    msg: string;
    data?: T;
    error?: {
        msg: string;
    };
}

// 타입 가드 함수들
const isRsDataFormat = (res: any): res is RsData<any> => {
    return res && typeof res === 'object' && 'resultCode' in res && 'msg' in res;
};

const hasError = (res: any): res is { error: { msg: string } } => {
    return res && typeof res === 'object' && 'error' in res && res.error && 'msg' in res.error;
};

// 데이터 변환 함수들
const transformOrderToDisplayData = (
  order: OrderDto, 
  orderItems: OrderItemDto[] = []
): OrderDisplayData => {
  return {
    id: order.id ?? 0,
    date: formatDate(order.createDate ?? ''),
    status: mapPaymentStatusToDisplayStatus(order.paymentStatus ?? ''),
    items: orderItems.map(item => transformOrderItemToDisplayData(item)),
    totalPrice: order.totalPrice ?? 0,
    orderCount: order.orderCount ?? 0,
    paymentMethod: order.paymentMethod ?? '',
    address: order.address ?? '',
    userId: order.userId ?? 0,
    userName: order.userName ?? ''
  };
};

const transformOrderItemToDisplayData = (orderItem: OrderItemDto): OrderItemDisplayData => {
  return {
    id: orderItem.id ?? 0,
    productId: orderItem.productId ?? 0,
    name: `상품 ${orderItem.productId}`, // 임시 - 실제로는 상품 정보 API 호출 필요
    price: orderItem.unitPrice ?? 0,
    quantity: orderItem.quantity ?? 0,
    totalPrice: orderItem.totalPrice ?? 0
  };
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const mapPaymentStatusToDisplayStatus = (paymentStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    'PENDING': '처리중',
    'COMPLETED': '완료'
  };
  
  return statusMap[paymentStatus] || paymentStatus;
};

export const mapDisplayStatusToPaymentStatus = (displayStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    '처리중': 'PENDING',
    '완료': 'COMPLETED'
  };
  
  return statusMap[displayStatus] || displayStatus;
};

const transformOrdersToDisplayData = (
  orders: OrderDto[],
  orderItemsMap: { [orderId: number]: OrderItemDto[] } = {}
): OrderDisplayData[] => {
  return orders.map(order => 
    transformOrderToDisplayData(order, orderItemsMap[order.id ?? 0] || [])
  );
};

// 메인 훅
export const useCreateOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItemDto[]>([]);

    const createOrder = (orderData: CreateOrderRequest) => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch('/api/v1/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        })
        .then((res: any) => {
            setIsLoading(false);
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            // RsData 형식이면 data를 반환, 아니면 res 자체를 반환
            if (isRsDataFormat(res)) {
                return res.data;
            }
            return res;
        });
    };

    const createOrderItem = (orderItemData: CreateOrderItemRequest) => {
        return apiFetch('/api/v1/orderItems', {
            method: 'POST',
            body: JSON.stringify(orderItemData)
        })
        .then((res: any) => {
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            if (isRsDataFormat(res)) {
                return res.data;
            }
            return res;
        });
    };

    // 일반 사용자용 주문 수정 함수
    const updateMyOrder = (orderId: number, orderData: UpdateMyOrderRequest) => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch(`/api/v1/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify(orderData)
        })
        .then((res: any) => {
            setIsLoading(false);
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            if (isRsDataFormat(res)) {
                return res.data;
            }
            return res;
        })
        .catch(err => {
            setIsLoading(false);
            setError(err.message || '주문 수정에 실패했습니다.');
            throw err;
        });
    };

    // 일반 사용자용 주문 삭제 함수
    const deleteMyOrder = (orderId: number) => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch(`/api/v1/orders/${orderId}`, {
            method: 'DELETE'
        })
        .then((res: any) => {
            setIsLoading(false);
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            if (isRsDataFormat(res)) {
                return res.data;
            }
            return res;
        })
        .catch(err => {
            setIsLoading(false);
            setError(err.message || '주문 삭제에 실패했습니다.');
            throw err;
        });
    };

    // 관리자용 주문 수정 함수
    const updateOrder = (orderId: number, orderData: UpdateOrderRequest) => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch(`/api/v1/adm/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify(orderData)
        })
        .then((res: any) => {
            setIsLoading(false);
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            if (isRsDataFormat(res)) {
                return res.data;
            }
            return res;
        });
    };

    // 관리자용 주문 삭제 함수
    const deleteOrder = (orderId: number) => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch(`/api/v1/adm/orders/${orderId}`, {
            method: 'DELETE'
        })
        .then((res: any) => {
            setIsLoading(false);
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            if (isRsDataFormat(res)) {
                return res.data;
            }
            return res;
        });
    };

    const updateOrderItem = (orderItemId: number, orderItemData: UpdateOrderItemRequest) => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch(`/api/v1/adm/orderItems/${orderItemId}`, {
            method: 'PUT',
            body: JSON.stringify(orderItemData)
        })
        .then((res: any) => {
            setIsLoading(false);
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            if (isRsDataFormat(res)) {
                return res.data;
            }
            return res;
        });
    };

    const deleteOrderItem = (orderItemId: number) => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch(`/api/v1/adm/orderItems/${orderItemId}`, {
            method: 'DELETE'
        })
        .then((res: any) => {
            setIsLoading(false);
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            if (isRsDataFormat(res)) {
                return res.data;
            }
            return res;
        });
    };

    const getAllOrders = () => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch('/api/v1/adm/orders', {
            method: 'GET'
        })
        .then((res: any) => {
            setIsLoading(false);
            
            // 배열이면 그대로 사용
            if (Array.isArray(res)) {
                setOrders(res);
                return res;
            }
            
            // 에러 체크
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            // RsData 형식이면 data 필드 사용
            if (isRsDataFormat(res) && res.data) {
                const ordersData = Array.isArray(res.data) ? res.data : [];
                setOrders(ordersData);
                return ordersData;
            }
            
            // 그 외의 경우 빈 배열 반환
            setOrders([]);
            return [];
        })
        .catch(err => {
            setIsLoading(false);
            setError(err.message || '주문 목록을 불러오는데 실패했습니다.');
            throw err;
        });
    };

    // 주문 목록을 표시용 데이터로 변환해서 반환하는 함수
    const getAllOrdersForDisplay = async (): Promise<OrderDisplayData[]> => {
        const orders = await getAllOrders();
        
        // 각 주문의 아이템들을 가져와서 매핑 생성
        const orderItemsMap: { [orderId: number]: OrderItemDto[] } = {};
        
        for (const order of orders) {
            try {
                const items = await getOrderItems(order.id);
                orderItemsMap[order.id] = items;
            } catch (error) {
                console.error(`주문 ${order.id}의 아이템을 불러오는데 실패:`, error);
                orderItemsMap[order.id] = [];
            }
        }
        
        return transformOrdersToDisplayData(orders, orderItemsMap);
    };

    const getMyOrders = () => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch('/api/v1/orders/my', {
            method: 'GET'
        })
        .then((res: any) => {
            setIsLoading(false);
            console.log('apiFetch 응답:', res);
            
            // 배열이면 그대로 사용
            if (Array.isArray(res)) {
                setOrders(res);
                return res;
            }
            
            // 에러 체크
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            // RsData 형식이면 data 필드 사용
            if (isRsDataFormat(res) && res.data) {
                const ordersData = Array.isArray(res.data) ? res.data : [];
                setOrders(ordersData);
                return ordersData;
            }
            
            // 그 외의 경우 빈 배열 반환
            setOrders([]);
            return [];
        })
        .catch(err => {
            setIsLoading(false);
            if (err.msg) {
                setError(err.msg);
            } else {
                setError(err.message || '알 수 없는 오류가 발생했습니다.');
            }
            throw err;
        });
    };

    const getOrderItems = (orderId: number) => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch(`/api/v1/orderItems/order/${orderId}`, {
            method: 'GET'
        })
        .then((res: any) => {
            setIsLoading(false);
            console.log('getOrderItems apiFetch 응답:', res);
            
            // 배열이면 그대로 사용
            if (Array.isArray(res)) {
                setOrderItems(res);
                return res;
            }
            
            // 에러 체크
            if (hasError(res)) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            
            // RsData 형식이면 data 필드 사용
            if (isRsDataFormat(res) && res.data) {
                const itemsData = Array.isArray(res.data) ? res.data : [];
                setOrderItems(itemsData);
                return itemsData;
            }
            
            // 그 외의 경우 빈 배열 반환
            setOrderItems([]);
            return [];
        })
        .catch(err => {
            setIsLoading(false);
            if (err.msg) {
                setError(err.msg);
            } else {
                setError(err.message || '알 수 없는 오류가 발생했습니다.');
            }
            throw err;
        });
    };

    const processCompleteOrder = (
        orderData: CreateOrderRequest,
        cartItems: Array<{ id: number; quantity: number; price: number }>
    ) => {
        setIsLoading(true);
        setError(null);

        return createOrder(orderData)
            .then(order => {
                const orderItemsData = cartItems.map(item => ({
                    orderId: order.id,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    productId: item.id
                }));
                
                return orderItemsData.reduce((promise, itemData) => {
                    return promise.then(results => {
                        return createOrderItem(itemData)
                            .then(orderItem => [...results, orderItem]);
                    });
                }, Promise.resolve([] as OrderItemDto[]))
                .then(orderItems => {
                    setIsLoading(false);
                    return { order, orderItems };
                });
            })
            .catch(err => {
                setIsLoading(false);
                throw err;
            });
    };

    return {
        // 기본 주문 생성 및 조회 함수들
        createOrder,
        createOrderItem,
        processCompleteOrder,
        getMyOrders,
        getOrderItems,
        
        // 일반 사용자용 주문 수정/삭제 함수들
        updateMyOrder,
        deleteMyOrder,
        
        // 관리자용 함수들
        getAllOrders,
        getAllOrdersForDisplay,
        updateOrder,      // 관리자용 주문 수정
        deleteOrder,      // 관리자용 주문 삭제
        updateOrderItem,  // 관리자용 주문아이템 수정
        deleteOrderItem,  // 관리자용 주문아이템 삭제
        
        // 유틸리티 함수들
        transformOrderToDisplayData,
        transformOrdersToDisplayData,
        mapDisplayStatusToPaymentStatus,
        
        // 상태들
        orders,
        orderItems,
        isLoading,
        error
    };
};