package com.back.domain.wishList.wishList.dto;


import com.back.domain.wishList.wishList.entity.WishList;
import org.jspecify.annotations.NonNull;

public record WishListDto (
        @NonNull Long productId,
        String productName,
        String productImageUrl,
        Integer productPrice
) {
    public WishListDto(Long productId) {
        this(productId, null, null, null);
    }

    public WishListDto(WishList wishList) {
        this(
                (long) wishList.getProduct().getId(), //
                wishList.getProduct().getName(),
                getFirstImageUrl(wishList),
                wishList.getProduct().getPrice()
        );
    }

    private static @NonNull String getFirstImageUrl(WishList wishList) {
        return wishList.getProduct().getProductImages().isEmpty() ? "" : wishList.getProduct().getProductImages().get(0).getUrl();
    }
}
