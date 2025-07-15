package com.back.global.rq;

import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.global.exception.ServiceException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
@RequiredArgsConstructor
public class Rq {
    private final HttpServletRequest req;
    private final HttpServletResponse res;
    private final UserService userService;

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

    public User getActor() {
        return userService.findById(getCurrentUserId())
                .orElseThrow(() -> new ServiceException("403-1", "존재하지 않는 사용자입니다."));
    }
}