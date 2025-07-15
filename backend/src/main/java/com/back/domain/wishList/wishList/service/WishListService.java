package com.back.domain.wishList.wishList.service;

import com.back.domain.product.product.service.ProductService;
import com.back.domain.product.product.entity.Product;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.domain.wishList.wishList.entity.WishList;
import com.back.domain.wishList.wishList.repository.WishListRepository;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WishListService {
    private final WishListRepository wishListRepository;
    private final UserService userService;
    private final ProductService productService;

    public void addToWishList(int userId, int productId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
        Product product = productService.findById(productId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 상품입니다."));

        WishList wishList = new WishList(user, product);
        wishListRepository.save(wishList);
    }

    public void removeWishList(Long currentUserId, Long productId) {
    }

    public WishList addWishList(Long currentUserId, @NotNull Long productId) {
    }
}