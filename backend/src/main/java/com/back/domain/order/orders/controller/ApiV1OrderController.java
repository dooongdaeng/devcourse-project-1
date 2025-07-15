package com.back.domain.order.orders.controller;


import com.back.domain.order.orders.dto.OrderDto;
import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.service.OrderService;
import com.back.global.rq.Rq;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "ApiV1OrderController", description = "주문 API 컨트롤러")
public class ApiV1OrderController {
    private final OrderService orderService;
    private final Rq rq;

    record OrderCreateReqBody(
            @NotBlank
            int orderCount,
            @NotBlank
            int totalPrice,
            @NotBlank
            @Size(min = 2, max = 100)
            String paymentMethod,
            @NotBlank
            @Size(min = 2, max = 100)
            String paymentStatus
    ) {
    }

    @PostMapping
    @Transactional
    @Operation(summary = "주문 생성")
    public RsData<OrderDto> write(
            @Valid @RequestBody OrderCreateReqBody reqBody
    ) {

        Orders order = orderService.create(
                reqBody.orderCount(),
                reqBody.totalPrice(),
                reqBody.paymentMethod(),
                reqBody.paymentStatus()
        );

        return new RsData<>(
                "201-1",
                "%d번 주문이 생성되었습니다.".formatted(order.getId()),
                new OrderDto(order)
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "주문 단건 조회")
    public OrderDto getOrder(@PathVariable int id) {
        Orders order = orderService.findById(id).get();

        return new OrderDto(order);
    }

    @GetMapping
    @Operation(summary = "주문 목록 조회")
    public List<OrderDto> getOrders() {
        List<Orders> orders = orderService.findAll();
        List<OrderDto> orderDtos = orders.stream()
                .map(OrderDto::new)
                .toList();

        return orderDtos;
    }


}
