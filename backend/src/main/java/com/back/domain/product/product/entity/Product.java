package com.back.domain.product.product.entity;

import com.back.domain.product.productImage.entity.ProductImage;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity
@Getter
@NoArgsConstructor
public class Product extends BaseEntity {
    @Column(length = 100)
    private String name;

    private int price;

    @Column(length = 100)
    private String description;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> productImages = new ArrayList<>();

    private int stock;

    public Product(String name, int price, String description, int stock) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.stock = stock;
    }

    public ProductImage addProductImage(String url) {
        ProductImage productImage = new ProductImage(url, this);
        productImages.add(productImage);
        return productImage;
    }

    public void modify(String name, int price, String description, int stock) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.stock = stock;
    }

    public Optional<ProductImage> findProductImageById(int id) {
        return productImages.stream()
                .filter(productImage -> productImage.getId() == id)
                .findFirst();
    }
}
