package com.back.domain.order.orders.controller;

import com.back.domain.order.orders.dto.OrderDto;
import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.service.OrderService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/adm/orders")
@RequiredArgsConstructor
@Tag(name = "ApiV1AdmOrderController", description = "관리자용 주문 API 컨트롤러")
@SecurityRequirement(name = "bearerAuth")
public class ApiV1AdmOrderController {
    private final OrderService orderService;


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

    @GetMapping("/user/{userId}")
    @Operation(summary = "특정 사용자의 주문 목록 조회")
    public List<OrderDto> getOrdersByUserId(@PathVariable int userId) {
        List<Orders> orders = orderService.findByUserId(userId);
        List<OrderDto> orderDtos = orders.stream()
                .map(OrderDto::new)
                .toList();

        return orderDtos;
    }

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "주문 수정")
    public RsData<OrderDto> update(
            @PathVariable int id,
            @Valid @RequestBody ApiV1OrderController.OrderUpdateReqBody reqBody
    ) {
        Orders order = orderService.findById(id).get();

        orderService.update(
                order,
                reqBody.orderCount(),
                reqBody.totalPrice(),
                reqBody.paymentMethod(),
                reqBody.paymentStatus(),
                reqBody.address()
        );

        return new RsData<>(
                "200-1",
                "%d번 주문이 수정되었습니다.".formatted(id)
        );
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "삭제")
    public RsData<Void> delete(
            @PathVariable int id
    ) {
        Orders order = orderService.findById(id).get();

        orderService.delete(order);

        return new RsData<>(
                "200-1",
                "%d번 주문이 삭제되었습니다.".formatted(id)
        );
    }



}
