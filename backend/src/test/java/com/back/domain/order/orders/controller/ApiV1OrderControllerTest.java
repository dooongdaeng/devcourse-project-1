package com.back.domain.order.orders.controller;


import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.service.OrderService;
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

import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
    void t1() throws Exception {
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

        Orders order = orderService.findLatest().get();

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("write"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("%d번 주문이 생성되었습니다.".formatted(order.getId())))
                .andExpect(jsonPath("$.data.id").value(order.getId()))
                .andExpect(jsonPath("$.data.createDate").value(Matchers.startsWith(order.getCreateDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.data.modifyDate").value(Matchers.startsWith(order.getModifyDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.data.orderCount").value(order.getOrderCount()))
                .andExpect(jsonPath("$.data.totalPrice").value(order.getTotalPrice()))
                .andExpect(jsonPath("$.data.paymentMethod").value(order.getPaymentMethod()))
                .andExpect(jsonPath("$.data.paymentStatus").value(order.getPaymentStatus()));

    }

    @Test
    @DisplayName("주문 단건 조회 테스트")
    @WithMockUser
    void t2() throws Exception {
        int id = 1;

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/orders/" + id)
                )
                .andDo(print());

        Orders order = orderService.findById(id).get();

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("getOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(order.getId()))
                .andExpect(jsonPath("$.createDate").value(Matchers.startsWith(order.getCreateDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.modifyDate").value(Matchers.startsWith(order.getModifyDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.orderCount").value(order.getOrderCount()))
                .andExpect(jsonPath("$.totalPrice").value(order.getTotalPrice()))
                .andExpect(jsonPath("$.paymentMethod").value(order.getPaymentMethod()))
                .andExpect(jsonPath("$.paymentStatus").value(order.getPaymentStatus()));

    }

    @Test
    @DisplayName("주문 단건 조회 테스트, 404")
    @WithMockUser
    void t4() throws Exception {
        int id = Integer.MAX_VALUE;

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/orders/" + id)
                )
                .andDo(print());


        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("getOrder"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("주문 다건 조회 테스트")
    @WithMockUser
    void t3() throws Exception {

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/orders/")
                )
                .andDo(print());

        List<Orders> orders = orderService.findAll();

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("getOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(orders.size()));
        for(int i = 0; i < orders.size(); i++) {
            Orders order = orders.get(i);
            resultActions
                    .andExpect(jsonPath("$.id").value(order.getId()))
                    .andExpect(jsonPath("$.createDate").value(Matchers.startsWith(order.getCreateDate().toString().substring(0, 20))))
                    .andExpect(jsonPath("$.modifyDate").value(Matchers.startsWith(order.getModifyDate().toString().substring(0, 20))))
                    .andExpect(jsonPath("$.orderCount").value(order.getOrderCount()))
                    .andExpect(jsonPath("$.totalPrice").value(order.getTotalPrice()))
                    .andExpect(jsonPath("$.paymentMethod").value(order.getPaymentMethod()))
                    .andExpect(jsonPath("$.paymentStatus").value(order.getPaymentStatus()));
        }
    }


}
