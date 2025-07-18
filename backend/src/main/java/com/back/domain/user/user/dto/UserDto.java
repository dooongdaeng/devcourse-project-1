package com.back.domain.user.user.dto;

import com.back.domain.user.user.entity.User;
import org.springframework.lang.NonNull;

public record UserDto(
        @NonNull int id,
        @NonNull String username,
        @NonNull String nickname,
        @NonNull String email,
        @NonNull String address,
        @NonNull String postalCode,
        @NonNull String role
) {
    public UserDto(User user) {
        this(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getEmail(),
                user.getAddress(),
                user.getPostalCode(),
                user.getRole()
        );
    }
}