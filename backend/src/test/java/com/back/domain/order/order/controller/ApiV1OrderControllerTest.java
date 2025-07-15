package com.back.domain.order.order.controller;


import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.service.OrderService;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
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
public class ApiV1OrderControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        // 테스트용 사용자 생성
        testUser = userService.join("testuser", "1234", "test", "asdf", "asdf");
    }

    @Test
    @DisplayName("주문 생성 테스트")
    void t1() throws Exception{
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "userId" : 1,
                                            "orderCount" : 2,
                                            "totalPrice" : 20000,
                                            "paymentMethod" : "CARD"
                                        }
                                        """)
                )
                .andDo(print());

        Order order = orderService.findLatest().get();

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("write"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("주문이 생성되었습니다."))
                .andExpect(jsonPath("$.data.id").value(order.getId()))
                .andExpect(jsonPath("$.data.createDate").value(Matchers.startsWith(order.getCreateDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.data.modifyDate").value(Matchers.startsWith(order.getModifyDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.data.orderCount").value(order.getOrderCount()))
                .andExpect(jsonPath("$.data.totalPrice").value(order.getTotalPrice()))
                .andExpect(jsonPath("$.data.paymentMethod").value(order.getPaymentMethod()))
                .andExpect(jsonPath("$.data.paymentStatus").value(order.getPaymentStatus()))
    }

}
