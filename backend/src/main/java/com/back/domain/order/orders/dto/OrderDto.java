package com.back.domain.order.orders.dto;

import com.back.domain.order.orders.entity.Orders;

import java.time.LocalDateTime;

public record OrderDto(
        int id,
        LocalDateTime createDate,
        LocalDateTime modifyDate,
        int orderCount,
        int totalPrice,
        String paymentMethod,
        String paymentStatus
) {

    public OrderDto(Orders order) {
        this(
                order.getId(),
                order.getCreateDate(),
                order.getModifyDate(),
                order.getOrderCount(),
                order.getTotalPrice(),
                order.getPaymentMethod(),
                order.getPaymentStatus()
        );
    }
}
