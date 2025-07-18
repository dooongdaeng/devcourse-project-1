package com.back.domain.wishList.wishList.controller;

import com.back.domain.wishList.wishList.dto.WishListDto;
import com.back.domain.wishList.wishList.entity.WishList;
import com.back.domain.wishList.wishList.service.WishListService;
import com.back.global.rsData.RsData;
import com.back.global.security.UserSecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name="WishList", description = "위시리스트 API")
@RestController
@RequestMapping("/api/v1/wish-lists")
@RequiredArgsConstructor
public class ApiV1WishListController {
    private final WishListService wishListService;

    @Schema(description = "위시리스트 추가 요청 ")
    record WishListAddReqBody(
            int productId,
            @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
            Integer quantity
    ){
        public int getQuantityOrDefault() {
            return quantity != null ? quantity : 1;
        }
    }
    @Schema(description = "위시리스트 토글 요청")
    record WishListToggleReqBody(
            @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
            int productId
    ) {}

    @Operation(summary = "위시리스트 전체 조회", description = "현재 사용자의 모든 위시리스트를 조회합니다.")
    @GetMapping
    public RsData<List<WishListDto>> getAllWishLists(@AuthenticationPrincipal UserSecurityUser user) {
        List<WishList> wishLists = wishListService.getWishListsByUserId(user.getId());
        List<WishListDto> wishListDtos = wishLists.stream().map(WishListDto::new).collect(Collectors.toList());

        return new RsData<>("200", "위시리스트 조회 성공", wishListDtos);
    }

    @Operation(summary = "위시리스트 상품 존재 여부 확인", description = "특정 상품의 위시리스트 존재 여부를 확인합니다.")
    @GetMapping("/{productId}")
    public RsData<Boolean> checkWishListExists(
            @PathVariable int productId,
            @AuthenticationPrincipal UserSecurityUser user
    ) {
        boolean exists = wishListService.existsWishList(user.getId(), productId);

        return new RsData<>("200", "위시리스트 조회 성공", exists);
    }

    @Operation(summary = "위시리스트에 상품 추가", description = "특정 상품을 위시리스트에 추가합니다.")
    @PostMapping
    public RsData<WishListDto> addWishList(
            @Valid @RequestBody WishListAddReqBody reqBody,
            @AuthenticationPrincipal UserSecurityUser user
    ){
        WishList wishList = wishListService.addToWishList(user.getId(), reqBody.productId, reqBody.getQuantityOrDefault());

        return new RsData<>("201", "위시리스트에 추가했습니다.", new WishListDto(wishList));
    }

    @Operation(summary = "위시리스트에서 상품 삭제", description = "특정 상품을 위시리스트에서 삭제합니다.")
    @DeleteMapping("/{productId}")
    public RsData<WishListDto> removeWishList(
            @PathVariable int productId,
            @AuthenticationPrincipal UserSecurityUser user
    ){
        WishListDto removedWishList = wishListService.removeWishList(user.getId(), productId);

        return new RsData<>("200", "위시리스트에서 삭제했습니다.", removedWishList);
    }

    @Operation(summary = "찜한 상품 개수 조회", description = "현재 사용자가 찜한 상품의 총 개수를 조회합니다.")
    @GetMapping("/count")
    public RsData<Integer> getWishListItemsCount(@AuthenticationPrincipal UserSecurityUser user) {
        int count = wishListService.getWishListItemsCount(user.getId());

        return new RsData<>("200", "찜한 상품 개수 조회 성공", count);
    }

    @Operation(summary = "위시리스트 토글", description = "특정 상품을 위시리스트에 추가하거나 삭제합니다. (있으면 삭제, 없으면 추가)")
    @PostMapping("/toggle")
    public RsData<WishListDto> toggleWishList(
            @Valid @RequestBody WishListToggleReqBody reqBody,
            @AuthenticationPrincipal UserSecurityUser user
    ) {
        WishList wishList = wishListService.toggleWishList(user.getId(), reqBody.productId);

        if (wishList != null) {
            return new RsData<>("201", "위시리스트에 추가했습니다.", new WishListDto(wishList));
        } else {
            return new RsData<>("200", "위시리스트에서 삭제했습니다.", null);
        }
    }

    @Operation(summary = "위시리스트 전체 삭제", description = "현재 사용자의 모든 위시리스트를 삭제합니다.")
    @DeleteMapping("/clear")
    public RsData<String> clearWishList(@AuthenticationPrincipal UserSecurityUser user) {
        wishListService.clearWishList(user.getId());

        return new RsData<>("200", "위시리스트를 모두 삭제했습니다.", null);
    }
}