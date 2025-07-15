package com.back.domain.product.product.controller;

import com.back.domain.product.product.controller.service.ProductService;
import com.back.domain.product.product.entity.Product;
import com.back.global.rsData.RsData;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
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
    public RsData<Product> create(
            @Valid @RequestBody ProductCreateReqBody reqBody
    ) {
        Product product = productService.create(reqBody.name, reqBody.price, reqBody.description, reqBody.stock);

        return new RsData<>(
                "201-1",
                "%d번 상품이 등록되었습니다.".formatted(product.getId()),
                product
        );
    }
}
