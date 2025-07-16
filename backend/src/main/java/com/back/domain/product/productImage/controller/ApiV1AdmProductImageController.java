package com.back.domain.product.productImage.controller;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.domain.product.productImage.dto.ProductImageDto;
import com.back.domain.product.productImage.entity.ProductImage;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/adm/products/{productId}/images")
@RequiredArgsConstructor
@Tag(name = "ApiV1AdmProductImageController", description = "API 관리자용 상품 이미지 컨트롤러")
@SecurityRequirement(name = "bearerAuth")
public class ApiV1AdmProductImageController {
    private final ProductService productService;

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "삭제")
    public RsData<Void> delete(@PathVariable int productId, @PathVariable int id) {
        Product product = productService.findById(productId).get();
        ProductImage productImage = product.findProductImageById(id).get();

        productService.deleteProductImage(product, productImage);

        return new RsData<>(
                "200-1",
                "%d번 상품 이미지가 삭제되었습니다.".formatted(id)
        );
    }


    record ProductImageCreateReqBody(String url) {}

    @PostMapping
    @Transactional
    @Operation(summary = "생성")
    public RsData<ProductImageDto> create(
            @PathVariable int productId,
            @RequestBody ProductImageCreateReqBody requestBody
    ) {
        Product product = productService.findById(productId).get();
        ProductImage productImage = productService.createProductImage(product, requestBody.url);

        productService.flush();

        return new RsData<>(
                "201-1",
                "%d번 상품 이미지가 등록되었습니다.".formatted(productImage.getId()),
                new ProductImageDto(productImage)
        );
    }


    record ProductImageUpdateReqBody(String url) {}

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "수정")
    public RsData<Void> update(
            @PathVariable int productId,
            @PathVariable int id,
            @RequestBody ProductImageUpdateReqBody requestBody
    ) {
        Product product = productService.findById(productId).get();
        ProductImage productImage = product.findProductImageById(id).get();

        productService.modifyProductImage(productImage, requestBody.url);

        return new RsData<>(
                "200-1",
                "%d번 상품 이미지가 수정되었습니다.".formatted(id)
        );
    }
}
