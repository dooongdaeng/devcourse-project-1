package com.back.domain.user.user.repository;

import com.back.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    Optional<User> findByApiKey(String apiKey);

    Optional<User> findByEmail(String email);
}
