package com.back.domain.order.orderItem.controller;


import com.back.domain.order.orderItem.dto.OrderItemDto;
import com.back.domain.order.orderItem.entity.OrderItem;
import com.back.domain.order.orderItem.service.OrderItemService;
import com.back.global.rq.Rq;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orderItems")
@RequiredArgsConstructor
@Tag(name = "ApiV1OrderItemController", description = "주문 아이템 API 컨트롤러")
public class ApiV1OrderItemController {
    private final OrderItemService orderItemService;
    private final Rq rq;

    record OrderItemCreateReqBody(
            @NotNull
            @Positive
            int orderId,
            @NotNull
            @Positive
            int quantity,
            @NotNull
            @Positive
            int unitPrice,
            @NotNull
            @Positive
            int productId
    ) {
    }

    @PostMapping
    @Transactional
    @Operation(summary = "주문 아이템 생성")
    public RsData<OrderItemDto> create(
            @Valid @RequestBody OrderItemCreateReqBody reqBody
    ) {
        OrderItem orderItem = orderItemService.create(
                reqBody.orderId(),
                reqBody.quantity(),
                reqBody.unitPrice(),
                reqBody.productId()
        );

        return new RsData<>(
                "201-1",
                "%d번 주문 아이템이 생성되었습니다.".formatted(orderItem.getId()),
                new OrderItemDto(orderItem)
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "주문 아이템 단건 조회")
    public OrderItemDto getOrderItem(@PathVariable int id) {
        OrderItem orderItem = orderItemService.findById(id).get();

        return new OrderItemDto(orderItem);
    }

    @GetMapping
    @Operation(summary = "주문 아이템 다건 조회")
    public List<OrderItemDto> getOrderItems() {
        List<OrderItem> orderItems = orderItemService.findAll();
        return orderItems.stream()
                .map(OrderItemDto::new)
                .toList();
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "특정 주문의 아이템 목록 조회")
    public List<OrderItemDto> getOrderItemsByOrderId(@PathVariable int orderId) {
        List<OrderItem> orderItems = orderItemService.findByOrderId(orderId);
        return orderItems.stream()
                .map(OrderItemDto::new)
                .toList();
    }

}
