package com.back.domain.product.product.dto;

import com.back.domain.product.product.entity.Product;

import java.time.LocalDateTime;

public record ProductDto (
        int id,
        LocalDateTime createDate,
        LocalDateTime modifyDate,
        String name,
        int price,
        String description,
        int stock
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
