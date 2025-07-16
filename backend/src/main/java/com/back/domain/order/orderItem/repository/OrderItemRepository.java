package com.back.domain.order.orderItem.repository;

import com.back.domain.order.orderItem.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByProductId(int productId);

    Optional<OrderItem> findFirstByOrderByIdDesc();

}
