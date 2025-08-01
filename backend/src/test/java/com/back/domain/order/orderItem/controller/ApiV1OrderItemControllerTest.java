package com.back.domain.order.orderItem.controller;


import com.back.domain.order.orderItem.service.OrderItemService;
import com.back.domain.order.orders.service.OrderService;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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

    @Autowired
    private UserService userService;


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
                                            "productId": 1,
                                            "userId": 1,
                                            "address": "서울시 강남구 역삼동"
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




    @Test
    @DisplayName("특정 주문의 아이템 목록 조회 테스트")
    @WithMockUser
    void t4() throws Exception {
        mvc.perform(
                        get("/api/v1/orderItems/order/1")
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("getOrderItemsByOrderId"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2)) // Order 1에는 2개 OrderItem
                .andExpect(jsonPath("$[0].orderId").value(1))
                .andExpect(jsonPath("$[1].orderId").value(1));
    }




    @Test
    @DisplayName("주문 아이템 수정 테스트")
    void t7() throws Exception {
        int id = 1;

        User user = userService.findByUsername("user1").get();
        String userApiKey = user.getApiKey();

        ResultActions resultActions = mvc
                .perform(
                        MockMvcRequestBuilders.put("/api/v1/orderItems/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", "Bearer " + userApiKey)
                                .content("""
                                        {
                                            "quantity": 5,
                                            "unitPrice": 20000,
                                            "productId": 2
                                        }
                                        """)
                )
                .andDo(print());
        resultActions
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("1번 주문 아이템이 수정되었습니다."));
    }


    @Test
    @DisplayName("주문 아이템 수정 테스트 - 본인 주문 아이템이 아닐 때")
    void t12() throws Exception {
        int id = 1;

        User user = userService.findByUsername("user3").get();
        String userApiKey = user.getApiKey();

        ResultActions resultActions = mvc
                .perform(
                        MockMvcRequestBuilders.put("/api/v1/orderItems/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", "Bearer " + userApiKey)
                                .content("""
                                        {
                                            "quantity": 5,
                                            "unitPrice": 20000,
                                            "productId": 2
                                        }
                                        """)
                )
                .andDo(print());
        resultActions
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.resultCode").value("403-1"))
                .andExpect(jsonPath("$.msg").value("본인의 주문만 수정할 수 있습니다."));
    }

    @Test
    @DisplayName("존재하지 않는 주문 아이템 수정 테스트")
    @WithMockUser
    void t8() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        MockMvcRequestBuilders.put("/api/v1/orderItems/999")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "quantity": 3,
                                            "unitPrice": 15000,
                                            "productId": 1
                                        }
                                        """)
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("주문 아이템 수정 유효성 검증 테스트 - 음수 값")
    @WithMockUser
    void t9() throws Exception {

        ResultActions resultActions = mvc
                .perform(
                        put("/api/v1/orderItems/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "quantity": -1,
                                            "unitPrice": 10000,
                                            "productId": 1
                                        }
                                        """)
                )
                .andDo(print());
        resultActions
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("주문 아이템 삭제 테스트")
    void t10() throws Exception {

        User user = userService.findByUsername("user1").get();
        String userApiKey = user.getApiKey();

        ResultActions resultActions = mvc
                .perform(

                        delete("/api/v1/orderItems/1")
                                .header("Authorization", "Bearer " + userApiKey)
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("1번 주문 아이템이 삭제되었습니다."));

    }

    @Test
    @DisplayName("주문 아이템 삭제 테스트 - 본인 주문 아이템이 아닐 때")
    void t13() throws Exception {

        User user = userService.findByUsername("user3").get();
        String userApiKey = user.getApiKey();

        ResultActions resultActions = mvc
                .perform(

                        delete("/api/v1/orderItems/1")
                                .header("Authorization", "Bearer " + userApiKey)
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.resultCode").value("403-1"))
                .andExpect(jsonPath("$.msg").value("본인의 주문만 삭제할 수 있습니다."));
    }

    @Test
    @DisplayName("존재하지 않는 주문 아이템 삭제 테스트")
    @WithMockUser
    void t11() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/orderItems/999")
                                .with(csrf())
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isNotFound());
    }


}


