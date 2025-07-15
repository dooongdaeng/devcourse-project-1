package com.back.domain.wishList.wishList.repository;

import com.back.domain.wishList.wishList.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WishListRepository extends JpaRepository<WishList, Integer> {
    boolean existsByUserIdAndProductId(int userId, int productId);

    Optional<WishList> findByUserIdAndProductId(@Param("userId") int currentUserId, @Param("productId") int productId);


    List<WishList> findByUserIdOrderByModifyDateDesc(int userId);
}
