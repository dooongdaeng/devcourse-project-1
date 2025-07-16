package com.back.domain.product.productImage.dto;

import com.back.domain.product.productImage.entity.ProductImage;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;

public record ProductImageDto(
        @NonNull int id,
        @NonNull LocalDateTime createDate,
        @NonNull LocalDateTime modifyDate,
        @NonNull String url,
        @NonNull int productId
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
