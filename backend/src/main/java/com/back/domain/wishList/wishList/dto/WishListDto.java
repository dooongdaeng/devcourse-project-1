package com.back.domain.wishList.wishList.dto;


import com.back.domain.wishList.wishList.entity.WishList;
import org.jspecify.annotations.NonNull;

public record WishListDto (
        @NonNull Integer productId,
        String productName,
        String productImageUrl,
        Integer productPrice,
        Integer quantity
) {
    public WishListDto(Integer productId) {
        this(productId, null, null, null, 1);
    }

    public WishListDto(WishList wishList) {
        this(
                wishList.getProduct().getId(), //
                wishList.getProduct().getName(),
                getFirstImageUrl(wishList),
                wishList.getProduct().getPrice(),
                wishList.getQuantity()
        );
    }

    private static @NonNull String getFirstImageUrl(WishList wishList) {
        return wishList.getProduct().getProductImages().isEmpty() ? "" : wishList.getProduct().getProductImages().get(0).getUrl();
    }
}
