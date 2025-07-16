package com.back.domain.wishList.wishList.controller;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.domain.wishList.wishList.service.WishListService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApiV1WishListController {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private WishListService wishListService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @BeforeEach
    void setup() {
        // 초기 데이터 설정
        if (userService.count() == 0) {
            userService.create("testuser1", "password", "abc111@test.com", List.of("ROLE_USER"), "서울시 강남구");
            userService.create("testuser2", "password", "abc222@test.com", List.of("ROLE_USER"), "서울시 서초구");
            userService.create("testuser3", "password", "abc333@test.com", List.of("ROLE_USER"), "부산시 남구");
        }

        if (productService.count() == 0) {
            productService.create("상품1",  10000, "상품1 설명",5);
            productService.create("상품2",  20000, "상품2 설명",10);
            productService.create("상품3",  30000, "상품3 설명",15);
            productService.create("상품4",  40000, "상품4 설명",0);
        }

    }




}
