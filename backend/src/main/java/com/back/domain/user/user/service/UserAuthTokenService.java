package com.back.domain.user.user.service;

import com.back.domain.user.user.entity.User;
import com.back.standard.util.Ut;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserAuthTokenService{
    @Value("${custom.jwt.secretKey}")
    private String jwtSecretKey;

    @Value("${custom.jwt.expireSeconds}")
    private int expireSeconds;

    public String genAccessToken(User user) {
        return Ut.jwt.toString(
                jwtSecretKey,
                expireSeconds,
                Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "nickname", user.getNickname(),
                        "role", user.getRole()
                )
        );
    }

    public Map<String, Object> payload(String accessToken) {
        return Ut.jwt.payload(jwtSecretKey, accessToken);
    }
}