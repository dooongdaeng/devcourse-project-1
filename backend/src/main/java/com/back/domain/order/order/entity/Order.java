package com.back.domain.order.order.entity;

import com.back.domain.order.orderItem.entity.OrderItem;
import com.back.domain.user.user.entity.User;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Order extends BaseEntity {
    private int orderCount;
    private int totalPrice;
    private String paymentMethod;
    private String paymentStatus;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();
    @ManyToOne
    private User user;


    public Order(int orderCount, int totalPrice, String paymentMethod, String paymentStatus, User user) {
        this.orderCount = orderCount;

        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.user = user;
    }

}
