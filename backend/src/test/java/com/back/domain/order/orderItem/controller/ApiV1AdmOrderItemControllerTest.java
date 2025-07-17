package com.back.domain.order.orderItem.controller;


import com.back.domain.order.orderItem.service.OrderItemService;
import com.back.domain.order.orders.service.OrderService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApiV1AdmOrderItemControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Test
    @DisplayName("주문 아이템 단건 조회 테스트")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t2() throws Exception {
        mvc.perform(
                        get("/api/v1/adm/orderItems/1")
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1AdmOrderItemController.class))
                .andExpect(handler().methodName("getOrderItem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.productId").value(1))
                .andExpect(jsonPath("$.quantity").value(2))
                .andExpect(jsonPath("$.unitPrice").value(15000))
                .andExpect(jsonPath("$.totalPrice").value(30000))
                .andExpect(jsonPath("$.createDate").exists())
                .andExpect(jsonPath("$.modifyDate").exists());
    }

    @Test
    @DisplayName("존재하지 않는 주문 아이템 조회 테스트")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t6() throws Exception {
        mvc.perform(
                        get("/api/v1/adm/orderItems/999")
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1AdmOrderItemController.class))
                .andExpect(handler().methodName("getOrderItem"))
                .andExpect(status().isNotFound());
    }




    @Test
    @DisplayName("주문 아이템 다건 조회 테스트")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t3() throws Exception {
        mvc.perform(
                        get("/api/v1/adm/orderItems")
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1AdmOrderItemController.class))
                .andExpect(handler().methodName("getOrderItems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(8)) // 9개 OrderItem 확인
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].orderId").exists())
                .andExpect(jsonPath("$[0].productId").exists())
                .andExpect(jsonPath("$[0].quantity").exists())
                .andExpect(jsonPath("$[0].unitPrice").exists())
                .andExpect(jsonPath("$[0].totalPrice").exists());
    }

    @Test
    @DisplayName("특정 상품의 주문 아이템 목록 조회 테스트")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t5() throws Exception {
        mvc.perform(
                        get("/api/v1/adm/orderItems/product/1")
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1AdmOrderItemController.class))
                .andExpect(handler().methodName("getOrderItemsByProductId"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3)) // 상품1은 3개 주문에서 사용됨
                .andExpect(jsonPath("$[0].productId").value(1))
                .andExpect(jsonPath("$[1].productId").value(1))
                .andExpect(jsonPath("$[2].productId").value(1));
    }


    @Test
    @DisplayName("주문 아이템 수정 테스트")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t7() throws Exception {

        ResultActions resultActions = mvc
                .perform(
                        MockMvcRequestBuilders.put("/api/v1/adm/orderItems/1")
                                .contentType(MediaType.APPLICATION_JSON)
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
                .andExpect(handler().handlerType(ApiV1AdmOrderItemController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("1번 주문 아이템이 수정되었습니다."));
    }

    @Test
    @DisplayName("주문 아이템 삭제 테스트")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void t10() throws Exception {

        ResultActions resultActions = mvc
                .perform(

                        delete("/api/v1/adm/orderItems/1")
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1AdmOrderItemController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("1번 주문 아이템이 삭제되었습니다."));

    }

}
