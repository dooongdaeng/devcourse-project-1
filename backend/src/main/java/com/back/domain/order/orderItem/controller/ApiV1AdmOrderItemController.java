package com.back.domain.order.orderItem.controller;


import com.back.domain.order.orderItem.dto.OrderItemDto;
import com.back.domain.order.orderItem.entity.OrderItem;
import com.back.domain.order.orderItem.service.OrderItemService;
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
@RequestMapping("/api/v1/adm/orderItems")
@RequiredArgsConstructor
@Tag(name = "ApiV1OrderController", description = "관리자용 주문 아이템 API 컨트롤러")
@SecurityRequirement(name = "bearerAuth")
public class ApiV1AdmOrderItemController {
    private final OrderItemService orderItemService;


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

    @GetMapping("/product/{productId}")
    @Operation(summary = "특정 상품의 주문 아이템 목록 조회")
    public List<OrderItemDto> getOrderItemsByProductId(@PathVariable int productId) {
        List<OrderItem> orderItems = orderItemService.findByProductId(productId);
        return orderItems.stream()
                .map(OrderItemDto::new)
                .toList();
    }

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "주문 아이템 수정 관리자용")
    public RsData<Void> update(
            @PathVariable int id,
            @Valid @RequestBody ApiV1OrderItemController.OrderItemUpdateReqBody reqBody
    ) {
        OrderItem orderItem = orderItemService.findById(id).get();

        orderItemService.update(
                orderItem,
                reqBody.quantity(),
                reqBody.unitPrice(),
                reqBody.productId()
        );

        return new RsData<>(
                "200-1",
                "%d번 주문 아이템이 수정되었습니다.".formatted(id)
        );
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "주문 아이템 삭제 관리자용")
    public RsData<Void> delete(
            @PathVariable int id
    ) {
        OrderItem orderItem = orderItemService.findById(id).get();


        orderItemService.delete(orderItem);

        return new RsData<>(
                "200-1",
                "%d번 주문 아이템이 삭제되었습니다.".formatted(id)
        );
    }


}
