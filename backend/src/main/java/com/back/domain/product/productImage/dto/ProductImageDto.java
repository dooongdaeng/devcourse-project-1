package com.back.domain.product.productImage.dto;

import com.back.domain.product.productImage.entity.ProductImage;

import java.time.LocalDateTime;

public record ProductImageDto(
        int id,
        LocalDateTime createDate,
        LocalDateTime modifyDate,
        String url,
        int productId
){
    public ProductImageDto(ProductImage productImage) {
        this(
                productImage.getId(),
                productImage.getCreateDate(),
                productImage.getModifyDate(),
                productImage.getUrl(),
                productImage.getProduct().getId()
        );
    }
}
