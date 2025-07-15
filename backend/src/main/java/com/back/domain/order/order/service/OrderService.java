package com.back.domain.order.order.service;

import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.repository.OrderRepository;
import com.back.domain.user.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;


    public Order write(int orderCount, int totalPrice, String paymentMethod, String paymentStatus, User user) {
        Order order = new Order(orderCount, totalPrice, paymentMethod, paymentStatus, user);

        return orderRepository.save(order);
    }

    public Optional<Order> findLatest() {
        return orderRepository.findFirstByOrderByIdDesc();
    }

}
