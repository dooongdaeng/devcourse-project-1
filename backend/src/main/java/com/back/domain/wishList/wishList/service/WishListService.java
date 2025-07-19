package com.back.domain.wishList.wishList.service;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.repository.ProductRepository;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.repository.UserRepository;
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
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public boolean existsWishList(int currentUserId, int productId) {
        return wishListRepository.existsByUserIdAndProductId(currentUserId, productId);

    }

    @Transactional(readOnly = true)
    public List<WishList> getWishListsByUserId(int userId) {
        return wishListRepository.findByUserIdOrderByCreateDateDesc(userId);
    }

    @Transactional
    public WishList toggleWishList(int userId, int productId) {
        Optional<WishList> existingWishList = wishListRepository.findByUserIdAndProductId(userId, productId);

        if (existingWishList.isPresent()) {
            wishListRepository.delete(existingWishList.get());
            return null; // 삭제된 경우 null 반환
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

            WishList wishList = new WishList(user, product);
            return wishListRepository.save(wishList);
        }

    }

    @Transactional
    public WishListDto removeWishList(int currentUserId, int productId) {
        WishList wishList = wishListRepository.findByUserIdAndProductId(currentUserId, productId)
                .orElseThrow(() -> new RuntimeException("해당 상품이 위시리스트에 없습니다."));

        wishListRepository.delete(wishList);
        return new WishListDto(wishList);
    }
}