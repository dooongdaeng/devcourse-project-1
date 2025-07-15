package com.back.domain.order.orders.service;

import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;


    public Orders write(int orderCount, int totalPrice, String paymentMethod, String paymentStatus) {
        Orders order = new Orders(orderCount, totalPrice, paymentMethod, paymentStatus);

        return orderRepository.save(order);
    }

    public Optional<Orders> findLatest() {
        return orderRepository.findFirstByOrderByIdDesc();
    }

}
