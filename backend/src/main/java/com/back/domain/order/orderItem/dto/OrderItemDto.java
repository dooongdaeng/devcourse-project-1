package com.back.domain.order.orderItem.dto;

import com.back.domain.order.orderItem.entity.OrderItem;

import java.time.LocalDateTime;

public record OrderItemDto(
        int id,
        LocalDateTime createDate,
        LocalDateTime modifyDate,
        int quantity,
        int unitPrice,
        int totalPrice,
        int productId,
        int orderId
) {

    public OrderItemDto(OrderItem orderItem) {
        this(
                orderItem.getId(),
                orderItem.getCreateDate(),
                orderItem.getModifyDate(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getTotalPrice(),
                orderItem.getProductId(),
                orderItem.getOrder().getId()
        );
    }
}