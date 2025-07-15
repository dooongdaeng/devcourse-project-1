package com.back.domain.product.product.controller.service;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;


    public Optional<Product> findLatest() {
        return productRepository.findFirstByOrderByIdDesc();
    }
}
