package com.back.domain.order.orderItem.controller;


import com.back.domain.order.orderItem.service.OrderItemService;
import com.back.domain.order.orders.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApiV1OrderItemControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private OrderService orderService;



    @Test
    @DisplayName("주문 아이템 생성 테스트")
    @WithMockUser
    void t1() throws Exception {
        mvc.perform(
                        post("/api/v1/orderItems")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                    {
                                        "orderId": 1,
                                        "quantity": 2,
                                        "unitPrice": 25000,
                                        "productId": 1
                                    }
                                    """)
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("create"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").exists())
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.orderId").value(1))
                .andExpect(jsonPath("$.data.quantity").value(2))
                .andExpect(jsonPath("$.data.unitPrice").value(25000))
                .andExpect(jsonPath("$.data.totalPrice").value(50000))
                .andExpect(jsonPath("$.data.productId").value(1));
    }

}


