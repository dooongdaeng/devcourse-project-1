package com.back.domain.user.user.dto;

import com.back.domain.user.user.entity.User;
import lombok.NonNull;

import java.time.LocalDateTime;

public record AdminUserDto(
        @NonNull int id,
        @NonNull String username,
        @NonNull String nickname,
        @NonNull String email,
        @NonNull LocalDateTime createDate,
        @NonNull LocalDateTime modifyDate,
        @NonNull String role
) {
    public AdminUserDto(User user) {
        this(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getEmail(),
                user.getCreateDate(),
                user.getModifyDate(),
                user.getRole()
        );
    }
}