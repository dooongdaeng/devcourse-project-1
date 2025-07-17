package com.back.domain.user.user.service;

import com.back.domain.user.user.entity.User;
import com.back.global.exception.ServiceException;
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

    @Value("${custom.accessToken.expirationSeconds}")
    private int expireSeconds;

    @Value("${custom.refreshToken.expirationSeconds}")
    private int refreshTokenExpireSeconds;

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

    public String genRefreshToken(User user) {
        return Ut.jwt.toString(
                jwtSecretKey,
                refreshTokenExpireSeconds, // 리프레시 토큰 만료 시간 사용
                Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "nickname", user.getNickname(),
                        "role", user.getRole()
                )
        );
    }

    public Map<String, Object> payload(String accessToken) {
        Map<String, Object> parsedPayload = Ut.jwt.payload(jwtSecretKey, accessToken);

        if (parsedPayload == null) throw new ServiceException("401-2", "액세스 토큰이 유효하지 않거나 만료되었습니다.");

        try {
            int id = (int) parsedPayload.get("id");
            String username = (String) parsedPayload.get("username");
            String nickname = (String) parsedPayload.get("nickname");
            String role = (String) parsedPayload.get("role");

            return Map.of(
                    "id", id,
                    "username", username,
                    "nickname", nickname,
                    "role", role
            );
        } catch (ClassCastException  e) {
            throw new ServiceException("401-2", "액세스 토큰 페이로드 형식이 올바르지 않습니다.");
        }
    }

    public Map<String, Object> payloadRefreshToken(String refreshToken) {
        Map<String, Object> parsedPayload = Ut.jwt.payload(jwtSecretKey, refreshToken);
        if (parsedPayload == null) return null;
        try {
            int id = (int) parsedPayload.get("id");
            String username = (String) parsedPayload.get("username");
            String nickname = (String) parsedPayload.get("nickname");
            String role = (String) parsedPayload.get("role");

            return Map.of(
                    "id", id,
                    "username", username,
                    "nickname", nickname,
                    "role", role
            );
        } catch (ClassCastException  e) {
            throw new ServiceException("401-5", "리프레시 토큰 페이로드 형식이 올바르지 않습니다.");
        }
    }
}