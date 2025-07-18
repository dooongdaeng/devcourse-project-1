package com.back.domain.order.orders.repository;

import com.back.domain.order.orders.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Orders, Integer> {
    // Additional query methods can be defined here if needed
    Optional<Orders> findFirstByOrderByIdDesc();

    List<Orders> findByUserId(int userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Orders o WHERE o.user.id = :userId")
    void deleteByUserId(int userId);
}
