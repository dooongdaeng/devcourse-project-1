package com.back.domain.product.product.service;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.repository.ProductRepository;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;


    public Optional<Product> findLatest() {
        return productRepository.findFirstByOrderByIdDesc();
    }

    public Product create(String name, int price, String description, int stock) {
        Product product = new Product(name, price, description, stock);
        return productRepository.save(product);
    }

    public Optional<Product> findById(int productId) {
        return productRepository.findById(productId);
    }

    public Long count() {
        return productRepository.count();
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public void delete(Product product) {
        productRepository.delete(product);
    }

    public void modify(Product product, String name, int price, String description, int stock) {
        product.modify(name, price, description, stock);
    }
}
