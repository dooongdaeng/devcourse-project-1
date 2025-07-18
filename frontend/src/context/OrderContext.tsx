"use client";

import { components } from "@/lib/backend/apiV1/schema";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/backend/client";

type OrderDto = components['schemas']['OrderDto'];
type OrderItemDto = components['schemas']['OrderItemDto'];

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
      .then((res) => {
        setIsLoading(false);
        if (res.error) {
          setError(res.error.msg);
          throw new Error(res.error.msg);
        }
        return res.data;
      });
    };

    const createOrderItem = (orderItemData: CreateOrderItemRequest) => {
        return apiFetch('/api/v1/orderItems', {
          method: 'POST',
          body: JSON.stringify(orderItemData)
        })
        .then((res) => {
          if (res.error) {
            setError(res.error.msg);
            throw new Error(res.error.msg);
          }
          return res.data;
        });
      };
      
      const getMyOrders = () => {
        setIsLoading(true);
        setError(null);
        
        return apiFetch('/api/v1/orders/my', {
            method: 'GET'
        })
        .then((res) => {
            setIsLoading(false);
            console.log('apiFetch 응답:', res); // 디버깅용
            
            // res가 직접 배열인 경우
            if (Array.isArray(res)) {
                setOrders(res);
                return res;
            }
            
            // res가 {data: [...], error: ...} 형태인 경우
            if (res.error) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            setOrders(res.data || []);
            return res.data;
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
        .then((res) => {
            setIsLoading(false);
            if (res.error) {
                setError(res.error.msg);
                throw new Error(res.error.msg);
            }
            setOrderItems(res.data || []);
            return res.data;
        })
        .catch(err => {
            setIsLoading(false);
            setError(err.message);
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
            
            // 순차적으로 주문 아이템 생성
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
        createOrder,
        createOrderItem,
        processCompleteOrder,
        getMyOrders,
        getOrderItems,
        orders,
        orderItems,
        isLoading,
        error
      };
    };