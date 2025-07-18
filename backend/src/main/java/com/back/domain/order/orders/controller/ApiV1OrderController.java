package com.back.domain.order.orders.controller;


import com.back.domain.order.orders.dto.OrderDto;
import com.back.domain.order.orders.entity.Orders;
import com.back.domain.order.orders.service.OrderService;
import com.back.global.rsData.RsData;
import com.back.global.security.UserSecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "ApiV1OrderController", description = "주문 API 컨트롤러")
@SecurityRequirement(name = "bearerAuth")
public class ApiV1OrderController {
    private final OrderService orderService;

    record OrderCreateReqBody(
            int orderCount,
            int totalPrice,
            @NotBlank
            @Size(min = 2, max = 100)
            String paymentMethod,
            @NotBlank
            @Size(min = 2, max = 100)
            String paymentStatus,
            @NotNull
            int userId,
            @NotBlank
            String address
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
                reqBody.paymentStatus(),
                reqBody.userId(),
                reqBody.address()
        );

        return new RsData<>(
                "201-1",
                "%d번 주문이 생성되었습니다.".formatted(order.getId()),
                new OrderDto(order)
        );
    }


    @GetMapping("/my")
    @Operation(summary = "내 주문 목록 조회")
    public List<OrderDto> getMyOrders(@AuthenticationPrincipal UserSecurityUser currentUser) {
//        if(currentUser == null) {
//            throw new ServiceException("401-1", "로그인이 필요합니다."); // 현재 사용자가 없으면 빈 리스트 반환
//        }

//        List<Orders> orders = orderService.findByUserId(currentUser.getId());

        int testUserId = 1; // 테스트용
        List<Orders> orders = orderService.findByUserId(testUserId); // 테스트용
        List<OrderDto> orderDtos = orders.stream()
                .map(OrderDto::new)
                .toList();

        return orderDtos;
    }



    record OrderUpdateReqBody(
            int orderCount,
            int totalPrice,
            @NotBlank
            @Size(min = 2, max = 100)
            String paymentMethod,
            @NotBlank
            @Size(min = 2, max = 100)
            String paymentStatus,
            @NotBlank
            String address
    ) {
    }

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "주문 수정")
    public RsData<OrderDto> update(
            @PathVariable int id,
            @Valid @RequestBody OrderUpdateReqBody reqBody,
            @AuthenticationPrincipal UserSecurityUser currentUser
    ) {
        Orders order = orderService.findById(id).get();

        order.checkCanUpdate(currentUser.getId());

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
            @PathVariable int id,
            @AuthenticationPrincipal UserSecurityUser currentUser
    ) {
        Orders order = orderService.findById(id).get();

        order.checkCanDelete(currentUser.getId());

        orderService.delete(order);

        return new RsData<>(
                "200-1",
                "%d번 주문이 삭제되었습니다.".formatted(id)
        );
    }
}
