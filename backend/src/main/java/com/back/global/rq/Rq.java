package com.back.global.rq;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
@RequiredArgsConstructor
@Getter
public class Rq {
    private final HttpServletRequest req;
    private final HttpServletResponse resp;

    public void setCookie(String name, String value) {
        setCookie(name, value, false, false, "Lax", 60 * 60 * 24 * 365);
    }

    public void setCookie(String name, String value, boolean httpOnly) {
        setCookie(name, value, httpOnly, false, "Lax", 60 * 60 * 24 * 365);
    }

    public String getCookieValue(String name, String defaultValue) {
        if (req.getCookies() == null) return defaultValue;
        return Arrays.stream(req.getCookies())
                .filter(cookie -> cookie.getName().equals(name))
                .map(Cookie::getValue)
                .filter(value -> !value.isBlank())
                .findFirst()
                .orElse(defaultValue);
    }

    public void setCookie(String name, String value, boolean httpOnly, boolean secure, String sameSite, int maxAgeSeconds) {
        if (value == null) {
            value = "";
        }

        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(httpOnly);
        cookie.setSecure(secure);

        if (sameSite != null && !sameSite.isBlank()) {
            cookie.setAttribute("SameSite", sameSite);
        }

        if (value.isBlank()) {
            cookie.setMaxAge(0);
        } else {
            cookie.setMaxAge(maxAgeSeconds);
        }

        resp.addCookie(cookie);
    }

    public void deleteCookie(String name) {
        setCookie(name, "", true, false, "Lax", 0);
    }

    public String getHeader(String name, String defaultValue) {
        return Optional
                .ofNullable(req.getHeader(name))
                .filter(headerValue -> !headerValue.isBlank())
                .orElse(defaultValue);
    }

    public void setHeader(String name, String value) {
        // null이 넘어오면 빈 문자열로 처리하여 헤더를 비우는 효과를 냄
        String actualValue = (value == null) ? "" : value;

        // 비어있든 아니든 최종적으로 설정될 값으로 한 번만 호출
        resp.setHeader(name, actualValue);
    }

}