package com.back.global.initData;

import com.back.domain.order.orderItem.service.OrderItemService;
import com.back.domain.order.orders.service.OrderService;
import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.domain.user.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class BaseInitData {
    @Autowired
    @Lazy
    private BaseInitData self;
    private final ProductService productService;
    private final UserService userService;
    private final OrderService orderService;
    private final OrderItemService orderItemService;

    @Bean
    ApplicationRunner baseInitDataApplicationRunner() {
        return args -> {
            self.work1();
            self.work2();
            self.work3();
            self.work4();
        };
    }

    @Transactional
    public void work1(){
        if (productService.count() > 0) return;

        Product product1 = productService.create("상품1", 10000, "상품1입니다.", 100);
        product1.addProductImage("/images/coffee_1.jpg");

        Product product2 = productService.create("상품2", 10000, "상품2입니다.", 100);
        product2.addProductImage("/images/coffee_2.jpg");

        Product product3 = productService.create("상품3", 10000, "상품3입니다.", 100);
        product3.addProductImage("/images/coffee_3.jpg");

        Product product4 = productService.create("상품4", 10000, "상품4입니다.", 100);
        product4.addProductImage("/images/coffee_4.jpg");
    }

    @Transactional
    public void work2() {
        if (userService.count() > 0) return;

        userService.create("user1", "1234", "user1@test.com", List.of("ROLE_USER"), "서울시 강남구");
        userService.create("user2", "1234", "user2@test.com", List.of("ROLE_USER"), "서울시 서초구");
        userService.create("user3", "1234", "user3@test.com", List.of("ROLE_USER"), "서울시 종로구");
        userService.create("user4", "1234", "user4@test.com", List.of("ROLE_USER"), "서울시 마포구");
        userService.create("admin", "1234", "admin@test.com", List.of("ROLE_ADMIN"), "서울시 중구");
    }

    @Transactional
    public void work3() {
        orderService.create(3, 45000, "card", "pending", 1);
        orderService.create(10, 12000, "card", "pending", 2);
        orderService.create(7, 80000, "bank_transfer", "completed", 1);
        orderService.create(2, 5000, "card", "completed", 3);

    }

    @Transactional
    public void work4() {
        if (orderItemService.count() > 0) return;

        // Order ID 1의 OrderItem들
        orderItemService.create(1, 2, 10000, 1); // 상품1 2개
        orderItemService.create(1, 1, 15000, 2); // 상품2 1개

        // Order ID 2의 OrderItem들
        orderItemService.create(2, 5, 1200, 1);  // 상품1 5개
        orderItemService.create(2, 3, 2000, 3);  // 상품3 3개
        orderItemService.create(2, 2, 1000, 4);  // 상품4 2개

        // Order ID 3의 OrderItem들
        orderItemService.create(3, 4, 10000, 2); // 상품2 4개
        orderItemService.create(3, 3, 15000, 4); // 상품4 3개

        // Order ID 4의 OrderItem들
        orderItemService.create(4, 1, 5000, 1);  // 상품1 1개
    }

}