package com.back.domain.wishList.wishList.controller;

import com.back.domain.wishList.wishList.dto.WishListDto;
import com.back.domain.wishList.wishList.entity.WishList;
import com.back.domain.wishList.wishList.service.WishListService;
import com.back.global.rsData.RsData;
import com.back.global.security.SecurityUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/wish-lists")
@RequiredArgsConstructor
public class ApiV1WishListController {
    private final WishListService wishListService;

    record WishListAddReqBody(
            int productId,
            @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
            Integer quantity
    ){
        public int getQuantityOrDefault() {
            return quantity != null ? quantity : 1;
        }
    }

    record WishListUpdateQuantityReqBody(
            @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
            Integer quantity
    ) {}

    @GetMapping
    public RsData<List<WishListDto>> getAllWishLists(
            @AuthenticationPrincipal SecurityUser user
    ) {
        int currentUserId = user.getId();

        List<WishList> wishLists = wishListService.getWishListsByUserId(currentUserId);
        List<WishListDto> wishListDtos = wishLists.stream()
                .map(WishListDto::new)
                .collect(Collectors.toList());

        return new RsData<>("200", "위시리스트 조회 성공", wishListDtos);
    }

    @GetMapping("/{productId}")
    public RsData<Boolean> detailWishList(
            @PathVariable int productId,
            @AuthenticationPrincipal SecurityUser user
    ) {
        int currentUserId = user.getId();
        boolean exists = wishListService.existsWishList(currentUserId, productId);

        return new RsData<>("200", "위시리스트 조회 성공", exists);
    }

    @PostMapping
    public RsData<WishListDto> addWishList(
            @Valid @RequestBody WishListAddReqBody reqBody,
            @AuthenticationPrincipal SecurityUser user
    ){
        int currentUserId = user.getId();
        WishList wishList = wishListService.addToWishList(currentUserId, reqBody.productId, reqBody.getQuantityOrDefault());

        return new RsData<>("201", "위시리스트에 추가했습니다.", new WishListDto(wishList));
    }

    @DeleteMapping("/{productId}")
    public RsData<WishListDto> removeWishList(
            @PathVariable int productId,
            @AuthenticationPrincipal SecurityUser user
    ){
        int currentUserId = user.getId();
        WishListDto removedWishList = wishListService.removeWishList(currentUserId, productId);

        return new RsData<>("200", "위시리스트에서 삭제했습니다.", removedWishList);
    }

    @PutMapping("/{productId}/quantity")
    public RsData<WishListDto> updateWishListQuantity(
            @PathVariable int productId,
            @Valid @RequestBody WishListUpdateQuantityReqBody reqBody,
            @AuthenticationPrincipal SecurityUser user
    ) {
        int currentUserId = user.getId();
        if (reqBody.quantity == null) {
            return new RsData<>("400", "수량은 필수입니다.", null);
        }
        WishList wishList = wishListService.updateQuantity(currentUserId, productId, reqBody.quantity);

        return new RsData<>("200", "위시리스트 수량을 업데이트했습니다.", new WishListDto(wishList));
    }


}