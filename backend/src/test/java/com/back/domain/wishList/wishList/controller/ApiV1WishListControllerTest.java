package com.back.domain.wishList.wishList.controller;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.domain.wishList.wishList.entity.WishList;
import com.back.domain.wishList.wishList.service.WishListService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApiV1WishListControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private WishListService wishListService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private Product testProduct;
    @BeforeEach
    void setup() {
        // 초기 데이터 설정
        userService.create("testuser1", "password", "abc111@test.com", List.of("ROLE_USER"), "서울시 강남구");
        productService.create("상품1",  10000, "상품1 설명",5);

        testUser = userService.findByUsername("testuser1").get();
        testProduct = productService.findAll().stream()
                .filter(p -> "상품1".equals(p.getName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("테스트 상품을 찾을 수 없습니다."));
    }

    @Test
    @DisplayName("사용자 위시리스트 목록 조회")
    @WithUserDetails(value="testuser1",setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void getWishList() throws Exception {

        wishListService.addToWishList(testUser.getId(), testProduct.getId());

        mvc.perform(get("/api/v1/wish-lists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200"))
                .andExpect(jsonPath("$.msg").value("위시리스트 조회 성공"))
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].productId").value(testProduct.getId()));
    }

    @Test
    @DisplayName("위시리스트 상품 삭제")
    @WithUserDetails(value="testuser1",setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void removeFromWishList() throws Exception {
        User user = userService.findByUsername("testuser1").get();
        Product product = productService.findAll().get(0);
        wishListService.addToWishList(user.getId(), product.getId());

        mvc.perform(delete("/api/v1/wish-lists/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200"))
                .andExpect(jsonPath("$.msg").value("위시리스트에서 삭제했습니다."))
                .andExpect(jsonPath("$.data.productId").value(1));
    }

    @Test
    @DisplayName("위시리스트 단건 조회")
    @WithUserDetails(value="testuser1",setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void getWishListById() throws Exception {
        WishList wishList = wishListService.addToWishList(testUser.getId(), testProduct.getId());

        mvc.perform(get("/api/v1/wish-lists/" + testProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200"))
                .andExpect(jsonPath("$.msg").value("위시리스트 조회 성공"))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    @DisplayName("위시리스트에 상품 추가")
    @WithUserDetails(value="testuser1",setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void addToWishList() throws Exception {
        String requestBody = objectMapper.writeValueAsString(
                Map.of("productId", testProduct.getId(), "quantity", 1)
        );

        mvc.perform(post("/api/v1/wish-lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201"))
                .andExpect(jsonPath("$.msg").value("위시리스트에 추가했습니다."))
                .andExpect(jsonPath("$.data.productName").value("상품1"));
    }

    @Test
    @DisplayName("위시리스트 수량 업데이트")
    @WithUserDetails(value="testuser1",setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void updateWishListQuantity() throws Exception {
        wishListService.addToWishList(testUser.getId(), testProduct.getId());

        String requestBody = objectMapper.writeValueAsString(
                Map.of("quantity", 3)
        );

        mvc.perform(put("/api/v1/wish-lists/" + testProduct.getId() + "/quantity")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200"))
                .andExpect(jsonPath("$.msg").value("위시리스트 수량을 업데이트했습니다."))
                .andExpect(jsonPath("$.data.productName").value("상품1"))
                .andExpect(jsonPath("$.data.quantity").value(3));
    }
}
