package com.back.domain.order.order.dto;

import com.back.domain.order.order.entity.Order;

import java.time.LocalDateTime;

public record OrderDto(
        int id,
        LocalDateTime createDate,
        LocalDateTime modifyDate,
        int orderCount,
        int totalPrice,
        String paymentMethod,
        String paymentStatus,
        int userId
) {

    public OrderDto(Order order) {
        this(
                order.getId(),
                order.getCreateDate(),
                order.getModifyDate(),
                order.getOrderCount(),
                order.getTotalPrice(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getUser().getId()
        );
    }
}
