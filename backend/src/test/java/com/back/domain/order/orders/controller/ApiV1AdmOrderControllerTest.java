package com.back.domain.order.orders.controller;


import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.service.OrderService;
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
public class ApiV1AdmOrderControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;


    @Test
    @DisplayName("주문 단건 조회 테스트")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t2() throws Exception {
        int id = 1;

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/adm/orders/" + id)
                )
                .andDo(print());

        Orders order = orderService.findById(id).get();

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmOrderController.class))
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
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t4() throws Exception {
        int id = Integer.MAX_VALUE;

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/adm/orders/" + id)
                )
                .andDo(print());


        resultActions
                .andExpect(handler().handlerType(ApiV1AdmOrderController.class))
                .andExpect(handler().methodName("getOrder"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("주문 다건 조회 테스트")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t3() throws Exception {

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/adm/orders")
                )
                .andDo(print());

        List<Orders> orders = orderService.findAll();

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmOrderController.class))
                .andExpect(handler().methodName("getOrders"))
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
    @DisplayName("주문 다건 조회 테스트 (user 검색)")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t9() throws Exception {

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/adm/orders/user/1")
                )
                .andDo(print());

        List<Orders> orders = orderService.findByUserId(1);

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmOrderController.class))
                .andExpect(handler().methodName("getOrdersByUserId"))
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
    @DisplayName("주문 삭제 테스트 관리자")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t6() throws Exception {
        int id = 1;

        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/adm/orders/" + id)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(print());


        resultActions
                .andExpect(handler().handlerType(ApiV1AdmOrderController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 주문이 삭제되었습니다.".formatted(id)));
    }


    @Test
    @DisplayName("주문 수정 테스트 관리자")
    @WithMockUser(username = "admin", roles = {"ADMIN"})

    void t5() throws Exception {
        int id = 1;


        ResultActions resultActions = mvc
                .perform(
                        put("/api/v1/adm/orders/" + id)
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

        Orders order = orderService.findById(id).get();

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmOrderController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 주문이 수정되었습니다.".formatted(order.getId())));
    }


}
