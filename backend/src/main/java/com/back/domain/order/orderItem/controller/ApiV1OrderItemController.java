package com.back.domain.order.orderItem.controller;


import com.back.domain.order.orderItem.dto.OrderItemDto;
import com.back.domain.order.orderItem.entity.OrderItem;
import com.back.domain.order.orderItem.service.OrderItemService;
import com.back.global.rq.Rq;
import com.back.global.rsData.RsData;
import com.back.global.security.UserSecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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



    @GetMapping("/order/{orderId}")
    @Operation(summary = "특정 주문의 아이템 목록 조회")
    public List<OrderItemDto> getOrderItemsByOrderId(@PathVariable int orderId) {
        List<OrderItem> orderItems = orderItemService.findByOrderId(orderId);
        return orderItems.stream()
                .map(OrderItemDto::new)
                .toList();
    }



    record OrderItemUpdateReqBody(
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

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "주문 아이템 수정")
    public RsData<Void> update(
            @PathVariable int id,
            @Valid @RequestBody OrderItemUpdateReqBody reqBody,
            @AuthenticationPrincipal UserSecurityUser currentUser
    ) {
        OrderItem orderItem = orderItemService.findById(id).get();

        orderItem.checkCanUpdate(currentUser.getId());

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
    @Operation(summary = "주문 아이템 삭제")
    public RsData<Void> delete(
            @PathVariable int id,
            @AuthenticationPrincipal UserSecurityUser currentUser
    ) {
        OrderItem orderItem = orderItemService.findById(id).get();

        orderItem.checkCanDelete(currentUser.getId());

        orderItemService.delete(orderItem);

        return new RsData<>(
                "200-1",
                "%d번 주문 아이템이 삭제되었습니다.".formatted(id)
        );
    }

}
