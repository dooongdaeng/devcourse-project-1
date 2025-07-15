package com.back.domain.wishList.wishList.repository;

import com.back.domain.wishList.wishList.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishListRepository extends JpaRepository<WishList, Integer> {
    boolean existsByUserIdAndProductId(int userId, int productId);

    Optional<Object> findByUserIdAndProductId(int currentUserId, int productId);

    Optional<Object> findByUserId(int userId);
}
