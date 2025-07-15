package com.back.domain.user.user.dto;

import com.back.domain.user.user.entity.User;

public record UserWithUsernameDto(
        int id,
        String username,
        String nickname,
        String email,
        String address
) {
    public UserWithUsernameDto(User user) {
        this(user.getId(), user.getUsername(), user.getNickname(), user.getEmail(), user.getAddress());
    }
}