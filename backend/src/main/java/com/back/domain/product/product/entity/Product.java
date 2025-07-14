package com.back.domain.product.product.entity;

import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Product extends BaseEntity {
    @Column(length = 100)
    private String name;

    private int price;

    @Column(length = 100)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String image;

    private int stock;
}
