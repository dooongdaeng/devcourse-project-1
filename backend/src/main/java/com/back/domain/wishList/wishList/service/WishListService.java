package com.back.domain.wishList.wishList.service;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.domain.wishList.wishList.dto.WishListDto;
import com.back.domain.wishList.wishList.entity.WishList;
import com.back.domain.wishList.wishList.repository.WishListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishListService {
    private final WishListRepository wishListRepository;
    private final UserService userService;
    private final ProductService productService;

    @Transactional
    public WishList addToWishList(int userId, int productId) {
        return addToWishList(userId, productId, 1);
    }

    @Transactional
    public WishList addToWishList(int userId, int productId, int quantity) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
        Product product = productService.findById(productId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 상품입니다."));

        Optional<WishList> existingWishList = wishListRepository.findByUserIdAndProductId(userId, productId);

        if (existingWishList.isPresent()) {
            WishList wishList = existingWishList.get();
            wishList.updateQuantity(wishList.getQuantity() + quantity);
            return wishListRepository.save(wishList);
        }

        WishList wishList = new WishList(user, product, quantity);
        return wishListRepository.save(wishList);
    }

    @Transactional
    public WishList updateQuantity(int userId, int productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");
        }

        WishList wishList = wishListRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("해당 상품이 위시리스트에 없습니다."));

        wishList.updateQuantity(quantity);
        return wishListRepository.save(wishList);

    }

    @Transactional
    public WishListDto removeWishList(int currentUserId, int productId) {
        WishList wishList = wishListRepository.findByUserIdAndProductId(currentUserId, productId)
                .orElseThrow(() -> new RuntimeException("해당 상품이 위시리스트에 없습니다."));

        wishListRepository.delete(wishList);

        return new WishListDto(wishList);
    }
    
    public boolean existsWishList(int currentUserId, int productId) {
        return wishListRepository.existsByUserIdAndProductId(currentUserId, productId);

    }

    public List<WishList> getWishListsByUserId(int userId) {
        return wishListRepository.findByUserIdOrderByCreateDateDesc(userId);
    }
}