package com.back.domain.user.user.entity;

import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class User extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String nickname;

    @Column(unique = true, nullable = false)
    private String email;

    private String address;

    @Column(nullable = false)
    private String role;  // ex: "ROLE_USER", "ROLE_ADMIN"

    public User(String username, String password, String nickname, String email, String address) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.address = address;
        this.role = "ROLE_USER";
    }

    public User(String username, String password, String nickname, String email, String address, String role) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.address = address;
        this.role = role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
