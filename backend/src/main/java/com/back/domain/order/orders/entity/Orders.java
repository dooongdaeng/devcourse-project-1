package com.back.domain.order.orders.entity;

import com.back.domain.order.orderItem.entity.OrderItem;
import com.back.domain.user.user.entity.User;
import com.back.global.exception.ServiceException;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
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
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();



    public Orders(int orderCount, int totalPrice, String paymentMethod, String paymentStatus, User user, String address) {
        this.orderCount = orderCount;
        this.user = user;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.address = address;
    }

    public void update(int orderCount, int totalPrice, String paymentMethod, String paymentStatus, String address) {
        this.orderCount = orderCount;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.address = address;
    }

    public void checkCanUpdate(int currentUserId) {
        if (this.user.getId() != currentUserId) {
            throw new ServiceException("403-1", "본인의 주문만 수정할 수 있습니다.");
        }
    }

    public void checkCanDelete(int currentUserId) {
        if (this.user.getId() != currentUserId) {
            throw new ServiceException("403-1", "본인의 주문만 삭제할 수 있습니다.");
        }
    }

}
