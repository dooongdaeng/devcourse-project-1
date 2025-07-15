package com.back.domain.order.orderItem.entity;

import com.back.domain.order.order.entity.Order;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@NoArgsConstructor
public class OrderItem extends BaseEntity {
    private int quantity;
    private int unitPrice;
    private int totalPrice;
    private int productId;

    @ManyToOne
    private Order order;

    public OrderItem(Integer quantity, Integer unitPrice,
                     Integer totalPrice, Integer productId) {
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.productId = productId;
    }

}
