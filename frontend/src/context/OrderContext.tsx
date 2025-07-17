"use client";

import { components } from "@/lib/backend/apiV1/schema";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/backend/client";

export type CreateOrderRequest = {
    orderCount: number;
    totalPrice: number;
    paymentMethod: string;
    paymentStatus: string;
    userId: number;
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
      const processCompleteOrder = (
        orderData: CreateOrderRequest,
        cartItems: Array<{ id: number; quantity: number; price: string }>
      ) => {
        setIsLoading(true);
        setError(null);
    
        return createOrder(orderData)
          .then(order => {
            const orderItemsData = cartItems.map(item => ({
              orderId: order.id,
              quantity: item.quantity,
              unitPrice: parseInt(item.price),
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
        isLoading,
        error
      };
    };