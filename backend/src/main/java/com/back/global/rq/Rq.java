package com.back.global.rq;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
@RequiredArgsConstructor
public class Rq {
    private final HttpServletRequest req;
    private final HttpServletResponse res;

    public String getCookieValue(String name, String defaultValue) {
        if (req.getCookies() == null) return defaultValue;
        return Arrays.stream(req.getCookies())
                .filter(cookie -> cookie.getName().equals(name))
                .map(Cookie::getValue)
                .filter(value -> !value.isBlank())
                .findFirst()
                .orElse(defaultValue);
    }

    public void setCookie(String name, String value) {
        if (value == null) value = "";

        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setDomain("localhost");  // 필요시 도메인 환경변수 처리 권장
        cookie.setSecure(true);
        cookie.setAttribute("SameSite", "Strict");

        if (value.isBlank()) cookie.setMaxAge(0);
        else cookie.setMaxAge(60 * 60 * 24 * 365);

        res.addCookie(cookie);
    }

    public void deleteCookie(String name) {
        setCookie(name, null);
    }

    public String getHeader(String name, String defaultValue) {
        return Optional
                .ofNullable(req.getHeader(name))
                .filter(headerValue -> !headerValue.isBlank())
                .orElse(defaultValue);
    }

    public void setHeader(String name, String value) {
        if (value == null) value = "";

        if (value.isBlank()) {
            res.setHeader(name, value); // 빈 문자열로 설정하여 헤더 값을 제거하는 효과
        } else {
            res.setHeader(name, value);
        }
    }

}