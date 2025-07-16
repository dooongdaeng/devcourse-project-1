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

    public User(String username, String password, String nickname, String email, String address) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.address = address;
        this.role = "ROLE_USER";
        this.apiKey = generateApiKey();
    }

    @Builder
    public User(String username, String password, String nickname, String email, String address, String role) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.address = address;
        this.role = role;
        this.apiKey = apiKey != null ? apiKey : generateApiKey();
    }

    public User(int id, String username, String ninkName, String role) {
        setId(id);
        this.username = username;
        this.nickname = ninkName;
        this.role = role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    private String generateApiKey() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}