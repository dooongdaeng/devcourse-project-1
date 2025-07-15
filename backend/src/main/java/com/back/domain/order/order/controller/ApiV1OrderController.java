package com.back.domain.order.order.controller;


import com.back.domain.order.order.dto.OrderDto;
import com.back.domain.order.order.service.OrderService;
import com.back.global.rq.Rq;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "ApiV1OrderController", description = "주문 API 컨트롤러")
public class ApiV1OrderController {
    private final OrderService orderService;
    private final Rq rq;

    @GetMapping
    @Transactional(readOnly = true)
    @Operation(summary = "주문 목록 조회")
    public RsData<List<OrderDto>> getItems() {

    }

}
