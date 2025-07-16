package com.back.domain.order.orders.controller;


import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.service.OrderService;
import com.back.domain.user.user.entity.User;
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

import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
                                            "paymentStatus": "PENDING",
                                            "userId": 1
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
    @DisplayName("주문 수정 테스트")
    @WithMockUser
    void t5() throws Exception {
        int id = 1;

        User user = userService.findByUsername("user1").get();
        String userApiKey = user.getApiKey();

        ResultActions resultActions = mvc
                .perform(
                        put("/api/v1/orders/" + id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", "Bearer " + userApiKey)
                                .content("""
                                        {
                                            "orderCount": 5,
                                            "totalPrice": 150000,
                                            "paymentMethod": "CREDIT_CARD",
                                            "paymentStatus": "PENDING"
                                        }
                                        """)
                                .with(csrf())
                )
                .andDo(print());

        Orders order = orderService.findById(id).get();

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 주문이 수정되었습니다.".formatted(order.getId())));
    }

    @Test
    @DisplayName("주문 수정 테스트 - 권한 없음 (다른 사용자의 주문)")
    void t7() throws Exception {
        int id = 1; // 다른 사용자(user1)의 주문

        User user = userService.findByUsername("user3").get();
        String userApiKey = user.getApiKey();

        ResultActions resultActions = mvc
                .perform(
                        put("/api/v1/orders/" + id)
                                .header("Authorization", "Bearer " + userApiKey)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "orderCount": 5,
                                            "totalPrice": 150000,
                                            "paymentMethod": "CREDIT_CARD",
                                            "paymentStatus": "PENDING"
                                        }
                                        """)
                                .with(csrf())
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.resultCode").value("403-1"))
                .andExpect(jsonPath("$.msg").value("본인의 주문만 수정할 수 있습니다."));
    }

    @Test
    @DisplayName("주문 삭제 테스트")
    @WithMockUser
    void t6() throws Exception {
        int id = 1;

        User user = userService.findByUsername("user1").get();
        String userApiKey = user.getApiKey();

        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/orders/" + id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", "Bearer " + userApiKey)
                )
                .andDo(print());


        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 주문이 삭제되었습니다.".formatted(id)));
    }


    @Test
    @DisplayName("주문 삭제 테스트 - 권한 없음 (다른 사용자의 주문)")
    void t8() throws Exception {
        int id = 1;


        User user = userService.findByUsername("user3").get();
        String userApiKey = user.getApiKey();


        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/orders/" + id)
                                .header("Authorization", "Bearer " + userApiKey)
                )
                .andDo(print());


        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.resultCode").value("403-1"))
                .andExpect(jsonPath("$.msg").value("본인의 주문만 삭제할 수 있습니다."));
    }


    @Test
    @DisplayName("주문 다건 조회 테스트 (my 검색)")
    void t10() throws Exception {


        User user = userService.findByUsername("user1").get();
        String userApiKey = user.getApiKey();

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/orders/my")
                                .header("Authorization", "Bearer " + userApiKey)
                )
                .andDo(print());

        List<Orders> orders = orderService.findByUserId(1);

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("getMyOrders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(orders.size()));
        for(int i = 0; i < orders.size(); i++) {
            Orders order = orders.get(i);
            resultActions
                    .andExpect(jsonPath("$[" + i + "].id").value(order.getId()))  // $[0].id, $[1].id ...
                    .andExpect(jsonPath("$[" + i + "].createDate").value(Matchers.startsWith(order.getCreateDate().toString().substring(0, 20))))
                    .andExpect(jsonPath("$[" + i + "].modifyDate").value(Matchers.startsWith(order.getModifyDate().toString().substring(0, 20))))
                    .andExpect(jsonPath("$[" + i + "].orderCount").value(order.getOrderCount()))
                    .andExpect(jsonPath("$[" + i + "].totalPrice").value(order.getTotalPrice()))
                    .andExpect(jsonPath("$[" + i + "].paymentMethod").value(order.getPaymentMethod()))
                    .andExpect(jsonPath("$[" + i + "].paymentStatus").value(order.getPaymentStatus()));
        }
    }

    @Test
    @DisplayName("주문 다건 조회 실패(로그인 없이)")
    void t11() throws Exception {

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/orders/my")
                )
                .andDo(print());


        resultActions
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.resultCode").value("401-1"))
                .andExpect(jsonPath("$.msg").value("로그인 후 이용해주세요."));
    }




}
