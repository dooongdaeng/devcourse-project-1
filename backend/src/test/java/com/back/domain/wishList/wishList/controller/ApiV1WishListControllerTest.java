package com.back.domain.wishList.wishList.controller;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.domain.wishList.wishList.service.WishListService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

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


    @Test
    @DisplayName("사용자 위시리스트 목록 조회")
    @WithUserDetails("user1")
    void getWishList() throws Exception {
        User user = userService.findByUsername("user1").get();
        Product product = productService.findAll().get(0);

        wishListService.addToWishList(user.getId(), product.getId());

        mvc.perform(get("/api/v1/wish-lists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200"))
                .andExpect(jsonPath("$.msg").value("위시리스트 조회 성공"))
                .andExpect(jsonPath("$.data.length()").value(1));
    }

    @Test
    @DisplayName("위시리스트 상품 삭제")
    @WithUserDetails("user1")
    void removeFromWishList() throws Exception {
        User user = userService.findByUsername("user1").get();
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
    @WithUserDetails("user1")
    void getWishListById() throws Exception {
        User user = userService.findByUsername("user1").get();
        Product product = productService.findAll().get(0);
        wishListService.addToWishList(user.getId(), product.getId());

        mvc.perform(get("/api/v1/wish-lists/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200"))
                .andExpect(jsonPath("$.msg").value("위시리스트 조회 성공"))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    @DisplayName("위시리스트에 상품 추가")
    @WithUserDetails("user1")
    void addToWishList() throws Exception {
        Product product = productService.findAll().get(0);
        String requestBody = objectMapper.writeValueAsString(
                Map.of("productId", product.getId(), "quantity", 1)
        );

        mvc.perform(post("/api/v1/wish-lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201"))
                .andExpect(jsonPath("$.msg").value("위시리스트에 추가했습니다."))
                .andExpect(jsonPath("$.data.productName").value(product.getName()));
    }

    @Test
    @DisplayName("찜한 상품 개수 조회")
    @WithUserDetails("user1")
    void getWishListItemsCount() throws Exception {
        User user = userService.findByUsername("user1").get();
        Product product1 = productService.findAll().get(0);
        Product product2 = productService.findAll().get(1);

        wishListService.addToWishList(user.getId(), product1.getId());
        wishListService.addToWishList(user.getId(), product2.getId());

        mvc.perform(get("/api/v1/wish-lists/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200"))
                .andExpect(jsonPath("$.msg").value("찜한 상품 개수 조회 성공"))
                .andExpect(jsonPath("$.data").value(2));
    }



    @Test
    @DisplayName("위시리스트 토글 - 상품 추가 (위시리스트에 없는 경우)")
    @WithUserDetails("user1")
    void toggleWishList_add() throws Exception {
        Product product = productService.findAll().get(0); // ID 1번 상품이 user1 위시리스트에 없다고 가정
        String requestBody = objectMapper.writeValueAsString(
                Map.of("productId", product.getId())
        );

        mvc.perform(post("/api/v1/wish-lists/toggle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                )
                .andExpect(status().isCreated()) // 추가 시 201 Created 기대
                .andExpect(jsonPath("$.resultCode").value("201"))
                .andExpect(jsonPath("$.msg").value("위시리스트에 추가했습니다."))
                .andExpect(jsonPath("$.data.productId").value(product.getId()));

        mvc.perform(get("/api/v1/wish-lists/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    @DisplayName("위시리스트 토글 - 상품 삭제 (위시리스트에 있는 경우)")
    @WithUserDetails("user1")
    void toggleWishList_remove() throws Exception {
        User user = userService.findByUsername("user1").get();
        Product product = productService.findAll().get(0);
        wishListService.addToWishList(user.getId(), product.getId());

        String requestBody = objectMapper.writeValueAsString(
                Map.of("productId", product.getId())
        );

        mvc.perform(post("/api/v1/wish-lists/toggle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200"))
                .andExpect(jsonPath("$.msg").value("위시리스트에서 삭제했습니다."))
                .andExpect(jsonPath("$.data").doesNotExist()); // 삭제 시 data는 null이므로 존재하지 않음을 확인

        // 위시리스트에 더 이상 없는지 확인
        mvc.perform(get("/api/v1/wish-lists/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(false));
    }


    @Test
    @DisplayName("위시리스트 전체 삭제")
    @WithUserDetails("user1")
    void clearWishList() throws Exception {
        User user = userService.findByUsername("user1").get();
        Product product1 = productService.findAll().get(0);
        Product product2 = productService.findAll().get(1);

        wishListService.addToWishList(user.getId(), product1.getId());
        wishListService.addToWishList(user.getId(), product2.getId());

        mvc.perform(delete("/api/v1/wish-lists/clear"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200"))
                .andExpect(jsonPath("$.msg").value("위시리스트를 모두 삭제했습니다."))
                .andExpect(jsonPath("$.data").doesNotExist());

        mvc.perform(get("/api/v1/wish-lists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(0));
    }

}
