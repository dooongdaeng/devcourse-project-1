package com.back.domain.order.orders.repository;

import com.back.domain.order.orders.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Orders, Integer> {
    // Additional query methods can be defined here if needed
    Optional<Orders> findFirstByOrderByIdDesc();
}
