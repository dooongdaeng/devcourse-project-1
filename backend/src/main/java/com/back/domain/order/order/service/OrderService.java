package com.back.domain.order.order.service;

import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;


    public Order write(int userId, int i, int i1, String s) {
    }
}
