package com.back.domain.product.product.controller;

import com.back.domain.product.product.dto.ProductDto;
import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "ApiV1ProductController", description = "API 상품 컨트롤러")
public class ApiV1ProductController {
    private final ProductService productService;

    record ProductCreateReqBody(
            @NotBlank
            @Size(min = 2, max = 100)
            String name,
            @Min(100)
            @Max(1000000)
            int price,
            @NotBlank
            @Size(min = 2, max = 500)
            String description,
            @Min(1)
            @Max(10000)
            int stock
    ) {}

    @PostMapping
    @Transactional
    @Operation(summary = "작성")
    public RsData<ProductDto> create(
            @Valid @RequestBody ProductCreateReqBody reqBody
    ) {
        Product product = productService.create(reqBody.name, reqBody.price, reqBody.description, reqBody.stock);

        return new RsData<>(
                "201-1",
                "%d번 상품이 등록되었습니다.".formatted(product.getId()),
                new ProductDto(product)
        );
    }


    @GetMapping
    @Transactional
    @Operation(summary = "다건 조회")
    public List<ProductDto> getItems() {
        List<Product> items = productService.findAll();

        return items.stream()
                .map(ProductDto::new)
                .toList();
    }
}
