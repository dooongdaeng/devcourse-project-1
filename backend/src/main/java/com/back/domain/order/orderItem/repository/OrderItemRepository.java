package com.back.domain.order.orderItem.repository;

import com.back.domain.order.orderItem.entity.OrderItem;

import java.util.List;

public interface OrderItemRepository {
    List<OrderItem> findByProductId(int productId);
}
