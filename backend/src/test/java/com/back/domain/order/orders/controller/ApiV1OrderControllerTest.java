package com.back.domain.order.orders.controller;


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
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApiV1OrderControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private OrderService orderService;


    @Test
    @DisplayName("주문 생성 테스트")
    @WithMockUser
    void t1() throws Exception{
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "orderCount": 2,
                                            "totalPrice": 50000,
                                            "paymentMethod": "CREDIT_CARD",
                                            "paymentStatus": "PENDING"
                                        }
                                        """)
                                .with(csrf())
                )
                .andDo(print());

//        Orders order = orderService.findLatest().get();

        resultActions
                .andExpect(status().isOk());
    }

}
