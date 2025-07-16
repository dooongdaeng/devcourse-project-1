package com.back.domain.order.orderItem.entity;

import com.back.domain.order.orders.entity.Orders;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class OrderItem extends BaseEntity {
    private int quantity;
    private int unitPrice;
    private int totalPrice;
    private int productId;

    @ManyToOne
    private Orders order;

    public OrderItem(Integer quantity, Integer unitPrice,
                     Integer totalPrice, Integer productId) {
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.productId = productId;
    }

    public void update(int quantity, int unitPrice, int totalPrice, int productId) {
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.productId = productId;
    }

}
