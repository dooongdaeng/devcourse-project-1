package com.back.domain.product.product.controller;

import com.back.domain.product.product.dto.ProductDto;
import com.back.domain.product.product.dto.ProductWithImageUrlDto;
import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
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
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "ApiV1ProductController", description = "API 상품 컨트롤러")
public class ApiV1ProductController {
    private final ProductService productService;

    @GetMapping
    @Transactional(readOnly = true)
    @Operation(summary = "다건 조회")
    public List<ProductWithImageUrlDto> getItems() {
        List<Product> items = productService.findAll();

        return items.stream()
                .map(ProductWithImageUrlDto::new)
                .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    @Operation(summary = "단건 조회")
    public ProductWithImageUrlDto getItem(@PathVariable int id) {
        Product product = productService.findById(id).get();
        return new ProductWithImageUrlDto(product);
    }
}
