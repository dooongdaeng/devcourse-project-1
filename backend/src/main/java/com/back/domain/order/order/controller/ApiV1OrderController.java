package com.back.domain.order.order.controller;


import com.back.domain.order.order.dto.OrderDto;
import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.service.OrderService;
import com.back.domain.user.user.entity.User;
import com.back.global.rq.Rq;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "ApiV1OrderController", description = "주문 API 컨트롤러")
public class ApiV1OrderController {
    private final OrderService orderService;
    private final Rq rq;

    record OrderCreateReqBody(
            int orderCount,
            int totalPrice,
            String paymentMethod,
            String paymentStatus,
            User user
    ) {
    }

    @PostMapping
    @Transactional
    @Operation(summary = "주문 생성")
    public RsData<OrderDto> create(
            @Valid @RequestBody OrderCreateReqBody reqBody
    ) {
        if (!rq.isLogined()){
            return new RsData<>(
                    "401-1",
                    "로그인 후 이용해주세요."
            );
        }

        int userId = rq.getLoginedUserId();

        Order order = orderService.write(
                reqBody.orderCount(),
                reqBody.totalPrice(),
                reqBody.paymentMethod(),
                reqBody.paymentStatus(),
                reqBody.user()
        );

        return new RsData<>(
                "201-1",
                "주문이 생성되었습니다.",
                new OrderDto(order)
        );
    }

}
