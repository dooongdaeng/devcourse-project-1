package com.back.domain.wishList.wishList.repository;

import com.back.domain.wishList.wishList.dto.WishListDto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishListRepository extends JpaRepository<WishListDto, Long> {

}
