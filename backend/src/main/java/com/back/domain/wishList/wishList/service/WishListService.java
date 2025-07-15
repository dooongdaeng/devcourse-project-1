package com.back.domain.wishList.wishList.service;

import com.back.domain.product.product.controller.service.ProductService;
import com.back.domain.product.product.entity.Product;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.domain.wishList.wishList.dto.WishListDto;
import com.back.domain.wishList.wishList.entity.WishList;
import com.back.domain.wishList.wishList.repository.WishListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishListService {
    private final WishListRepository wishListRepository;
    private final UserService userService;
    private final ProductService productService;

    public WishList addToWishList(int userId, int productId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
        Product product = productService.findById(productId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 상품입니다."));

        if(wishListRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("이미 위시리스트에 추가된 상품입니다.");
        }
        WishList wishList = new WishList(user, product);

        return wishListRepository.save(wishList);
    }

    @Transactional
    public WishListDto removeWishList(int currentUserId, int productId) {
        WishList wishList = wishListRepository.findByUserIdAndProductId(currentUserId, productId)
                .orElseThrow(() -> new RuntimeException("해당 상품이 위시리스트에 없습니다."));

        wishListRepository.delete(wishList);

        return new WishListDto(wishList);
    }


    public List<WishList> getWishListsByUserId(int userId) {
        return wishListRepository.findByUserIdOrderByCreated(userId);
    }
}