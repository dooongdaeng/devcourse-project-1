package com.back.domain.user.user.entity;

import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Column;

public class User extends BaseEntity {
    @Column(unique=true, nullable=false)
    private String username;

    @Column(nullable=false)
    private String password;

    private String nickname;
}
