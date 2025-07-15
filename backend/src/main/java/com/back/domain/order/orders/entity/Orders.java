package com.back.domain.order.orders.entity;

import com.back.domain.order.orderItem.entity.OrderItem;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Orders extends BaseEntity {
    private int orderCount;
    private int totalPrice;
    private String paymentMethod;
    private String paymentStatus;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();



    public Orders(int orderCount, int totalPrice, String paymentMethod, String paymentStatus) {
        this.orderCount = orderCount;

        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }

    public void update(int orderCount, int totalPrice, String paymentMethod, String paymentStatus) {
        this.orderCount = orderCount;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }

}
