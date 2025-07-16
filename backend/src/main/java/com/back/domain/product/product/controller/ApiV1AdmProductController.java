package com.back.domain.product.product.controller;

import com.back.domain.product.product.dto.ProductDto;
import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/adm/products")
@RequiredArgsConstructor
@Tag(name = "ApiV1AdmProductController", description = "API 관리자용 상품 컨트롤러")
@SecurityRequirement(name = "bearerAuth")
public class ApiV1AdmProductController {
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
    @Operation(summary = "생성")
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


    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "삭제")
    public RsData<Void> delete(@PathVariable int id) {
        Product product = productService.findById(id).get();
        productService.delete(product);

        return new RsData<>(
                "200-1",
                "%d번 상품이 삭제되었습니다.".formatted(id)
        );
    }


    record ProductUpdateReqBody(
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


    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "수정")
    public RsData<Void> update(
            @PathVariable int id,
            @Valid @RequestBody ProductUpdateReqBody reqBody
    ) {
        Product product = productService.findById(id).get();
        productService.modify(product, reqBody.name, reqBody.price, reqBody.description, reqBody.stock);

        return new RsData<>(
                "200-1",
                "%d번 상품이 수정되었습니다.".formatted(id)
        );
    }
}
