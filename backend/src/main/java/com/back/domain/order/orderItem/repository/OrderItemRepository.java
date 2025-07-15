package com.back.domain.order.orderItem.repository;

import com.back.domain.order.orderItem.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
}
