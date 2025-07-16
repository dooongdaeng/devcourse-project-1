package com.back.global.rq;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
@RequiredArgsConstructor
public class Rq {
    private final HttpServletRequest req;
    private final HttpServletResponse res;

    public Integer getLoginedUserId() {
        return (Integer) req.getSession().getAttribute("loginedUserId");
    }

    public boolean isLogined() {
        return getLoginedUserId() != null;
    }

    public void login(int userId) {
        req.getSession().setAttribute("loginedUserId", userId);
    }

    public void logout() {
        req.getSession().invalidate();
    }

    public int getCurrentUserId() {
        Integer loginedUserId = getLoginedUserId();
        if (loginedUserId == null) {
            throw new IllegalStateException("로그인하지 않았습니다.");
        }
        return loginedUserId;
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

}