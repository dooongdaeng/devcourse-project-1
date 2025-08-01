package com.back.domain.product.productImage.controller;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.domain.product.productImage.dto.ProductImageDto;
import com.back.domain.product.productImage.entity.ProductImage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products/{productId}/images")
@RequiredArgsConstructor
@Tag(name = "ApiV1ProductImageController", description = "API 상품 이미지 컨트롤러")
public class ApiV1ProductImageController {
    private final ProductService productService;

    @GetMapping
    @Transactional(readOnly = true)
    @Operation(summary = "다건 조회")
    public List<ProductImageDto> getItems(@PathVariable int productId) {
        Product product = productService.findById(productId).get();

        return product.getProductImages().stream()
                .map(ProductImageDto::new)
                .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    @Operation(summary = "단건 조회")
    public ProductImageDto getItem(@PathVariable int productId, @PathVariable int id) {
        Product product = productService.findById(productId).get();
        ProductImage productImage = product.findProductImageById(id).get();

        return new ProductImageDto(productImage);
    }
}
