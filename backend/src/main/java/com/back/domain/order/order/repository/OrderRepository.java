package com.back.domain.order.order.repository;

import com.back.domain.order.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Additional query methods can be defined here if needed
    Optional<Order> findFirstByOrderByIdDesc();
}
