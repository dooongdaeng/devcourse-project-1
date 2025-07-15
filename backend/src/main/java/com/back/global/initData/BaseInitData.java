package com.back.global.initData;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@RequiredArgsConstructor
public class BaseInitData {
    @Autowired
    @Lazy
    private BaseInitData self;
    private final ProductService productService;

    @Bean
    ApplicationRunner baseInitDataApplicationRunner() {
        return args -> {
            self.work1();
        };
    }

    @Transactional
    public void work1(){
        if (productService.count() > 0) return;

        Product product1 = new Product("상품1", 10000, "상품1입니다.", 100);
        product1.addProductImage("/images/coffee_1.jpg");

        Product product2 = new Product("상품2", 10000, "상품2입니다.", 100);
        product2.addProductImage("/images/coffee_2.jpg");

        Product product3 = new Product("상품3", 10000, "상품3입니다.", 100);
        product3.addProductImage("/images/coffee_3.jpg");

        Product product4 = new Product("상품4", 10000, "상품4입니다.", 100);
        product4.addProductImage("/images/coffee_4.jpg");
    }
}