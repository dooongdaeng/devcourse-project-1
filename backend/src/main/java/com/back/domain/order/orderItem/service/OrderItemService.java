package com.back.domain.order.orderItem.service;


import com.back.domain.order.orderItem.entity.OrderItem;
import com.back.domain.order.orderItem.repository.OrderItemRepository;
import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderItemService {
    private final OrderItemRepository orderItemRepository;
    private final OrderService orderService;


    public OrderItem create(int orderId, int quantity, int unitPrice, int productId) {

        int totalPrice = quantity * unitPrice;

        // Order 조회
        Orders order = orderService.findById(orderId).get();

        OrderItem orderItem = new OrderItem(quantity, unitPrice, totalPrice, productId);
        orderItem.setOrder(order);

        return orderItemRepository.save(orderItem);
    }

    public Optional<OrderItem> findLatest() {
        return orderItemRepository.findFirstByOrderByIdDesc();
    }

    public long count() {
        return orderItemRepository.count();
    }

    public Optional<OrderItem> findById(int id) {
        return orderItemRepository.findById(id);
    }

    public List<OrderItem> findAll() {
        return orderItemRepository.findAll();
    }

    public List<OrderItem> findByOrderId(int orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public List<OrderItem> findByProductId(int productId) {
        return orderItemRepository.findByProductId(productId);
    }

    public void update(OrderItem orderItem, int quantity, int unitPrice, int productId) {
        int totalPrice = quantity * unitPrice;
        orderItem.update(quantity, unitPrice, totalPrice, productId);
    }

    public void delete(OrderItem orderItem) {
        orderItemRepository.delete(orderItem);
    }
}
