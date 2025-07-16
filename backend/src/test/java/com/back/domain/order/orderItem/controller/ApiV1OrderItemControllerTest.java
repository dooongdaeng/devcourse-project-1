package com.back.domain.order.orderItem.controller;


import com.back.domain.order.orderItem.entity.OrderItem;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

    @Test
    @DisplayName("주문 아이템 단건 조회 테스트")
    @WithMockUser
    void t2() throws Exception {
        mvc.perform(
                        get("/api/v1/orderItems/1")
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
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
    @DisplayName("주문 아이템 다건 조회 테스트")
    @WithMockUser
    void t3() throws Exception {
        mvc.perform(
                        get("/api/v1/orderItems")
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
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
    @DisplayName("특정 주문의 아이템 목록 조회 테스트 (추후 adm으로 옮겨야함)")
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
    @DisplayName("특정 상품의 주문 아이템 목록 조회 테스트")
    @WithMockUser
    void t5() throws Exception {
        mvc.perform(
                        get("/api/v1/orderItems/product/1")
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("getOrderItemsByProductId"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3)) // 상품1은 3개 주문에서 사용됨
                .andExpect(jsonPath("$[0].productId").value(1))
                .andExpect(jsonPath("$[1].productId").value(1))
                .andExpect(jsonPath("$[2].productId").value(1));
    }

    @Test
    @DisplayName("존재하지 않는 주문 아이템 조회 테스트")
    @WithMockUser
    void t6() throws Exception {
        mvc.perform(
                        get("/api/v1/orderItems/999")
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("getOrderItem"))
                .andExpect(status().isNotFound()); // RuntimeException 발생으로 500 에러
    }


    @Test
    @DisplayName("주문 아이템 수정 테스트")
    @WithMockUser
    void t8() throws Exception {
        // 수정 전 데이터 확인
        OrderItem beforeUpdate = orderItemService.findById(1).get();
        System.out.println("수정 전 - quantity: " + beforeUpdate.getQuantity() +
                ", unitPrice: " + beforeUpdate.getUnitPrice() +
                ", totalPrice: " + beforeUpdate.getTotalPrice());

        mvc.perform(
                        put("/api/v1/orderItems/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                    {
                                        "quantity": 5,
                                        "unitPrice": 20000,
                                        "productId": 2
                                    }
                                    """)
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1OrderItemController.class))
                .andExpect(handler().methodName("update"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("1번 주문 아이템이 수정되었습니다."))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.quantity").value(5))
                .andExpect(jsonPath("$.data.unitPrice").value(20000))
                .andExpect(jsonPath("$.data.totalPrice").value(100000)) // 5 * 20000
                .andExpect(jsonPath("$.data.productId").value(2))
                .andExpect(jsonPath("$.data.orderId").value(1)); // orderId는 그대로

        // 수정 후 데이터베이스에서 다시 조회해서 확인
        OrderItem afterUpdate = orderItemService.findById(1).get();
        assertThat(afterUpdate.getQuantity()).isEqualTo(5);
        assertThat(afterUpdate.getUnitPrice()).isEqualTo(20000);
        assertThat(afterUpdate.getTotalPrice()).isEqualTo(100000);
        assertThat(afterUpdate.getProductId()).isEqualTo(2);
    }

}


