package com.back.domain.product.product.dto;

import com.back.domain.product.product.entity.Product;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;

public record ProductDto (
        @NonNull int id,
        @NonNull LocalDateTime createDate,
        @NonNull LocalDateTime modifyDate,
        @NonNull String name,
        @NonNull int price,
        @NonNull String description,
        @NonNull int stock
){
    public ProductDto(Product product) {
        this(product.getId(),
                product.getCreateDate(),
                product.getModifyDate(),
                product.getName(),
                product.getPrice(),
                product.getDescription(),
                product.getStock()
        );
    }
}
