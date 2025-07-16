package com.back.domain.product.product.controller;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.domain.user.user.service.UserService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApiV1AdmProductControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private ProductService productService;
    @Autowired
    private UserService userService;

    @Test
    @DisplayName("상품 등록")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void t1() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/adm/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "상품 test",
                                            "price": 10000,
                                            "description": "상품 test",
                                            "stock": 10
                                        }
                                        """)
                ).andDo(print());

        Product product = productService.findLatest().get();

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmProductController.class))
                .andExpect(handler().methodName("create"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 등록되었습니다.".formatted(product.getId())))
                .andExpect(jsonPath("$.data.id").value(product.getId()))
                .andExpect(jsonPath("$.data.createDate").value(Matchers.startsWith(product.getCreateDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.data.modifyDate").value(Matchers.startsWith(product.getModifyDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.data.name").value(product.getName()))
                .andExpect(jsonPath("$.data.price").value(product.getPrice()))
                .andExpect(jsonPath("$.data.description").value(product.getDescription()))
                .andExpect(jsonPath("$.data.stock").value(product.getStock()));
    }

    @Test
    @DisplayName("상품 등록 - without name")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void t1_1() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/adm/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "",
                                            "price": 10000,
                                            "description": "상품 test",
                                            "stock": 10
                                        }
                                        """)
                ).andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmProductController.class))
                .andExpect(handler().methodName("create"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode").value("400-1"))
                .andExpect(jsonPath("$.msg").value("""
                        name-NotBlank-must not be blank
                        name-Size-size must be between 2 and 100
                        """.stripIndent().trim()));
    }

    @Test
    @DisplayName("상품 등록 - without price")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void t1_2() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/adm/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "상품 test",
                                            "price": 0,
                                            "description": "상품 test",
                                            "stock": 10
                                        }
                                        """)
                ).andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmProductController.class))
                .andExpect(handler().methodName("create"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode").value("400-1"))
                .andExpect(jsonPath("$.msg").value("""
                        price-Min-must be greater than or equal to 100
                        """.stripIndent().trim()));
    }
    
    @Test
    @DisplayName("상품 등록 - without Authorization header")
    public void t1_3() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/adm/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "상품 test",
                                            "price": 0,
                                            "description": "상품 test",
                                            "stock": 10
                                        }
                                        """)
                ).andDo(print());

        resultActions
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.resultCode").value("401-1"))
                .andExpect(jsonPath("$.msg").value("로그인 후 이용해주세요."));
    }

    @Test
    @DisplayName("상품 등록 - with wrong Authorization header")
    public void t1_4() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/adm/products")
                                .header("Authorization", "B")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "상품 test",
                                            "price": 0,
                                            "description": "상품 test",
                                            "stock": 10
                                        }
                                        """)
                ).andDo(print());

        resultActions
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.resultCode").value("401-2"))
                .andExpect(jsonPath("$.msg").value("Authorization 헤더가 Bearer 형식이 아닙니다."));
    }

    @Test
    @DisplayName("상품 등록 - with wrong ApiKey")
    public void t1_5() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/adm/products")
                                .header("Authorization", "Bearer wrongApiKey")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "상품 test",
                                            "price": 0,
                                            "description": "상품 test",
                                            "stock": 10
                                        }
                                        """)
                ).andDo(print());

        resultActions
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.resultCode").value("401-3"))
                .andExpect(jsonPath("$.msg").value("API 키가 유효하지 않습니다."));
    }

    @Test
    @DisplayName("상품 등록 - without permission")
    @WithMockUser(username = "user1", roles = {"USER"})
    public void t1_6() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/adm/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "상품 test",
                                            "price": 0,
                                            "description": "상품 test",
                                            "stock": 10
                                        }
                                        """)
                ).andDo(print());

        resultActions
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.resultCode").value("403-1"))
                .andExpect(jsonPath("$.msg").value("관리자만 접근할 수 있습니다."));
    }

    @Test
    @DisplayName("상품 삭제")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void t2() throws Exception {
        int id = 1;

        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/adm/products/%d".formatted(id))
                ).andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmProductController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 삭제되었습니다.".formatted(id)));
    }

    @Test
    @DisplayName("상품 수정")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void t3() throws Exception {
        int id = 1;

        ResultActions resultActions = mvc
                .perform(
                        put("/api/v1/adm/products/%d".formatted(id))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "상품 new",
                                            "price": 1000,
                                            "description": "상품 new",
                                            "stock": 100
                                        }
                                        """)
                ).andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmProductController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 수정되었습니다.".formatted(id)));

        Product product = productService.findById(id).get();

        assertThat(product.getName()).isEqualTo("상품 new");
        assertThat(product.getPrice()).isEqualTo(1000);
        assertThat(product.getDescription()).isEqualTo("상품 new");
        assertThat(product.getStock()).isEqualTo(100);
    }
}
