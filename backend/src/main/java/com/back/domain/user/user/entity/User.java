package com.back.domain.user.user.entity;

import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "users") // 예약어 충돌 방지
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

    @Column(unique = true, nullable = false)
    private String apiKey;

    @Column(length = 500)
    private String refreshToken;

    public User(String username, String password, String nickname, String email, String address) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.address = address;
        this.role = "ROLE_USER";
        this.apiKey = generateApiKey();
        this.refreshToken = null;
    }

    @Builder
    public User(String username, String password, String nickname, String email, String address, String role, String apiKey, String refreshToken) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.address = address;
        this.role = role;
        this.apiKey = (apiKey != null && !apiKey.isBlank()) ? apiKey : generateApiKey();
        this.refreshToken = refreshToken;

    }

    public User(int id, String username, String nickName, String role) {
        setId(id);
        this.username = username;
        this.nickname = nickName;
        this.role = role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    private String generateApiKey() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}