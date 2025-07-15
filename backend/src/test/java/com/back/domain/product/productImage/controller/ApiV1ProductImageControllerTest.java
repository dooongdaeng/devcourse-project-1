package com.back.domain.product.productImage.controller;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.domain.product.productImage.entity.ProductImage;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApiV1ProductImageControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private ProductService productService;

    @Test
    @DisplayName("상품 이미지 다건조회")
    public void t1() throws Exception {
        int id = 1;

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/products/%d/images".formatted(id))
                                .contentType(MediaType.APPLICATION_JSON)
                ).andDo(print());

        Product product = productService.findById(id).get();

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductImageController.class))
                .andExpect(handler().methodName("getItems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(product.getProductImages().size()));

        for (int i = 0; i < product.getProductImages().size(); i++) {
            ProductImage productImage = product.getProductImages().get(i);
            resultActions
                    .andExpect(jsonPath("$[%d].id".formatted(i)).value(productImage.getId()))
                    .andExpect(jsonPath("$[%d].createDate".formatted(i)).value(Matchers.startsWith(productImage.getCreateDate().toString().substring(0, 20))))
                    .andExpect(jsonPath("$[%d].modifyDate".formatted(i)).value(Matchers.startsWith(productImage.getModifyDate().toString().substring(0, 20))))
                    .andExpect(jsonPath("$[%d].url".formatted(i)).value(productImage.getUrl()))
                    .andExpect(jsonPath("$[%d].productId".formatted(i)).value(productImage.getProduct().getId()));
        }
    }

    @Test
    @DisplayName("상품 이미지 단건조회")
    public void t2() throws Exception {
        int productId = 1;
        int id = 1;

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/products/%d/images/%d".formatted(productId, id))
                                .contentType(MediaType.APPLICATION_JSON)
                ).andDo(print());

        Product product = productService.findById(productId).get();
        ProductImage productImage = product.findProductImageById(id).get();

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductImageController.class))
                .andExpect(handler().methodName("getItem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productImage.getId()))
                .andExpect(jsonPath("$.createDate").value(Matchers.startsWith(productImage.getCreateDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.modifyDate").value(Matchers.startsWith(productImage.getModifyDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.url").value(productImage.getUrl()))
                .andExpect(jsonPath("$.productId").value(productImage.getProduct().getId()));
    }

    @Test
    @DisplayName("상품 이미지 삭제")
    public void t3() throws Exception {
        int productId = 1;
        int id = 1;

        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/products/%d/images/%d".formatted(productId, id))
                                .contentType(MediaType.APPLICATION_JSON)
                ).andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductImageController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품 이미지가 삭제되었습니다.".formatted(id)));
    }

    @Test
    @DisplayName("상품 이미지 등록")
    public void t4() throws Exception {
        int productId = 1;

        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/products/%d/images".formatted(productId))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "url": "url"
                                        }
                                        """)
                ).andDo(print());

        Product product = productService.findById(productId).get();
        ProductImage productImage = product.getProductImages().getLast();

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductImageController.class))
                .andExpect(handler().methodName("create"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품 이미지가 등록되었습니다.".formatted(productImage.getId())))
                .andExpect(jsonPath("$.data.id").value(productImage.getId()))
                .andExpect(jsonPath("$.data.createDate").value(Matchers.startsWith(productImage.getCreateDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.data.modifyDate").value(Matchers.startsWith(productImage.getModifyDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.data.url").value(productImage.getUrl()));
    }
}
