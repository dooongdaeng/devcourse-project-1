package com.back.domain.order.orders.service;

import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.repository.OrderRepository;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserService userService;


    public Orders create(int orderCount, int totalPrice, String paymentMethod, String paymentStatus, int userId) {
        User user = userService.findById(userId).get();

        Orders order = new Orders(orderCount, totalPrice, paymentMethod, paymentStatus, user);

        return orderRepository.save(order);
    }

    public Optional<Orders> findLatest() {
        return orderRepository.findFirstByOrderByIdDesc();
    }

    public Optional<Orders> findById(int id) {
        return orderRepository.findById(id);
    }

    public List<Orders> findAll() {
        return orderRepository.findAll();
    }


    public void update(Orders orders, int orderCount, int totalPrice, String paymentMethod, String paymentStatus) {
        orders.update(orderCount, totalPrice, paymentMethod, paymentStatus);
    }

    public void delete(Orders order) {
        orderRepository.delete(order);
    }


    public List<Orders> findByUserId(int i) {
        return orderRepository.findByUserId(i);
    }
}
