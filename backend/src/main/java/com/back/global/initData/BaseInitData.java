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

        Product product1 = productService.create("Colombia Nariñó", 5000, "신선한 콜롬비아 원두입니다.", 100);
        product1.addProductImage("http://localhost:8080/images/coffee_1.png");

        Product product2 = productService.create("Brazil Serra Do Caparaó", 6000, "고소한 브라질 원두입니다.", 150);
        product2.addProductImage("http://localhost:8080/images/coffee_2.jpg");

        Product product3 = productService.create("Colombia Quindío (White Wine Extended Fermentation)", 6000, "달콤한 에티오피아 원두입니다.", 120);
        product3.addProductImage("http://localhost:8080/images/coffee_3.png");

        Product product4 = productService.create("Ethiopia Sidamo", 8000, "감미로운 에티오피아 원두입니다.", 80);
        product4.addProductImage("http://localhost:8080/images/coffee_4.png");
    }

    @Transactional
    public void work2() {
        if (userService.count() > 0) return;

        userService.create("user1", "1234", "user1@test.com", "testUser1",List.of("ROLE_USER"), "서울시 강남구", "11111");
        userService.create("user2", "1234", "user2@test.com", "testUser2",List.of("ROLE_USER"), "서울시 서초구", "22222");
        userService.create("user3", "1234", "user3@test.com", "testUser3",List.of("ROLE_USER"), "서울시 종로구", "33333");
        userService.create("user4", "1234", "user4@test.com", "testUser4",List.of("ROLE_USER"), "서울시 마포구", "44444");
        userService.create("admin", "1234", "admin@test.com", "admin",List.of("ROLE_ADMIN"), "서울시 중구", "55555");
    }

    @Transactional
    public void work3() {
        orderService.create(3, 16000, "card", "PENDING", 1, "서울시 강남구");
        orderService.create(2, 11000, "card", "PENDING", 2, "서울시 서초구");
        orderService.create(5, 32000, "bank_transfer", "COMPLETED", 1, "서울시 종로구");
        orderService.create(1, 8000, "card", "COMPLETED", 3, "서울시 강동구");

    }

    @Transactional
    public void work4() {
        if (orderItemService.count() > 0) return;

        // Order ID 1의 OrderItem들
        orderItemService.create(1, 2, 5000, 1); // 상품1 2개
        orderItemService.create(1, 1, 6000, 2); // 상품2 1개

        // Order ID 2의 OrderItem들
        orderItemService.create(2, 1, 5000, 1);  // 상품1 5개
        orderItemService.create(2, 1, 6000, 3);  // 상품3 3개

        // Order ID 3의 OrderItem들
        orderItemService.create(3, 4, 6000, 2); // 상품2 4개
        orderItemService.create(3, 1, 8000, 4); // 상품4 3개

        // Order ID 4의 OrderItem들
        orderItemService.create(4, 1, 8000, 4);  // 상품1 1개
    }

}