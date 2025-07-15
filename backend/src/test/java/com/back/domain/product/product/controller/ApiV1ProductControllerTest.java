package com.back.domain.product.product.controller;

import com.back.domain.product.product.controller.service.ProductService;
import com.back.domain.product.product.entity.Product;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApiV1ProductControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private ProductService productService;

    @Test
    @DisplayName("상품 등록")
    public void t1() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "상품 test",
                                            "price": 1000,
                                            "description": "상품 test",
                                            "stock": 10
                                        }
                                        """)
                ).andDo(print());

        Product product = productService.findLatest().get();

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("create"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 등록되었습니다.".formatted(1)))
                .andExpect(jsonPath("$.product.id").value(product.getId()))
                .andExpect(jsonPath("$.product.createDate").value(Matchers.startsWith(product.getCreateDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.product.modifyDate").value(Matchers.startsWith(product.getModifyDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.product.name").value(product.getName()))
                .andExpect(jsonPath("$.product.price").value(product.getPrice()))
                .andExpect(jsonPath("$.product.description").value(product.getDescription()))
                .andExpect(jsonPath("$.product.stock").value(product.getStock()));
    }
}
