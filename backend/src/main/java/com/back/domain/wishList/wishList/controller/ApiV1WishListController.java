package com.back.domain.wishList.wishList.controller;

import com.back.domain.wishList.wishList.dto.WishListDto;
import com.back.domain.wishList.wishList.entity.WishList;
import com.back.domain.wishList.wishList.service.WishListService;
import com.back.global.rq.Rq;
import com.back.global.rsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/wish-lists")
@RequiredArgsConstructor
public class ApiV1WishListController {
    private final WishListService wishListService;
    private final Rq rq;

    record WishListAddReqBody(
            int productId
    ){}

    @GetMapping
    @Transactional(readOnly = true)
    public RsData<List<WishListDto>> getAllWishLists() {
        int currentUserId = rq.getCurrentUserId();

        List<WishList> wishLists = wishListService.getWishListsByUserId(currentUserId);
        List<WishListDto> wishListDtos = wishLists.stream().map(WishListDto::new).collect(Collectors.toList());

        return new RsData<>("200", "위시리스트 조회 성공", wishListDtos);
    }

    @GetMapping("/{productId}")
    @Transactional(readOnly = true)
    public RsData<Boolean> checkWishList(@PathVariable int productId) {
        int currentUserId = rq.getCurrentUserId();
        boolean exists = wishListService.existsWishList(currentUserId, productId);

        return new RsData<>("200", "위시리스트 존재 여부 조회 성공", exists);
    }

    @PostMapping
    @Transactional
    public RsData<WishListDto> addWishList(@Valid @RequestBody WishListAddReqBody reqBody) {
        int currentUserId = rq.getCurrentUserId();
        WishList wishList = wishListService.addToWishList(currentUserId, reqBody.productId);

        return new RsData<>("201", "위시리스트에 추가했습니다.", new WishListDto(wishList));
    }

    @DeleteMapping("/{productId}")
    @Transactional
    public RsData<WishListDto> removeWishList(@PathVariable int productId) {
        int currentUserId = rq.getCurrentUserId();
        WishListDto removedWishList = wishListService.removeWishList(currentUserId, productId);

        return new RsData<>("200", "위시리스트에서 삭제했습니다.", removedWishList);
    }
}