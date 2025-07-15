package com.back.domain.order.orders.controller;


import com.back.domain.order.orders.dto.OrderDto;
import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.service.OrderService;
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
            String paymentStatus
    ) {
    }

    @PostMapping
    @Transactional
    @Operation(summary = "주문 생성")
    public RsData<OrderDto> write(
            @Valid @RequestBody OrderCreateReqBody reqBody
    ) {

        Orders order = orderService.write(
                reqBody.orderCount(),
                reqBody.totalPrice(),
                reqBody.paymentMethod(),
                reqBody.paymentStatus()
        );

        return new RsData<>(
                "201-1",
                "주문이 생성되었습니다.",
                new OrderDto(order)
        );
    }

}
