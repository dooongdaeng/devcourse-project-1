package com.back.domain.product.productImage.entity;

import com.back.domain.product.product.entity.Product;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class ProductImage extends BaseEntity {
    @Column(columnDefinition = "TEXT")
    private String url;

    @ManyToOne
    private Product product;

    public ProductImage(String url, Product product) {
        this.url = url;
        this.product = product;
    }

    public void modify(String url) {
        this.url = url;
    }
}
