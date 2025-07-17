package com.back.global.security;

import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserAuthTokenService;
import com.back.domain.user.user.service.UserService;
import com.back.global.exception.ServiceException;
import com.back.global.rq.Rq;
import com.back.global.rsData.RsData;
import com.back.standard.util.Ut;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Log
public class CustomAuthenticationFilter extends OncePerRequestFilter {
    private final Rq rq;
    private final UserService userService;
    private final UserAuthTokenService userAuthTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        logger.debug("Processing request for " + request.getRequestURI());

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !(authentication instanceof AnonymousAuthenticationToken)) {
                logger.debug("Already authenticated in SecurityContextHolder, skipping custom token validation for URI: " + request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }
            work(request, response, filterChain);
        } catch (ServiceException e) {
            RsData<Void> rsData = e.getRsData();
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(rsData.statusCode());
            response.getWriter().write(
                    Ut.json.toString(rsData)
            );
        } catch (Exception e) {
            throw e;
        }
    }

    private void work(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // API 요청이 아니라면 패스
        if (!request.getRequestURI().startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 인증, 인가가 필요없는 API 요청이라면 패스
        if (List.of("/api/v1/users/login", "/api/v1/users/logout", "/api/v1/users", "/api/v1/users/token/refresh").contains(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        String apiKey;
        String accessToken;
        String refreshToken;

        String headerAuthorization = rq.getHeader("Authorization", "");

        if (!headerAuthorization.isBlank()) {
            if (!headerAuthorization.startsWith("Bearer "))
                throw new ServiceException("401-2", "Authorization 헤더가 Bearer 형식이 아닙니다.");

            String[] headerAuthorizationBits = headerAuthorization.split(" ", 3);

            apiKey = headerAuthorizationBits[1];
            accessToken = headerAuthorizationBits.length == 3 ? headerAuthorizationBits[2] : "";
        } else {
            apiKey = rq.getCookieValue("apiKey", "");
            accessToken = rq.getCookieValue("accessToken", "");
        }
        refreshToken = rq.getCookieValue("refreshToken", "");

        logger.debug("apiKey : " + apiKey);
        logger.debug("accessToken : " + accessToken);
        logger.debug("refreshToken : " + refreshToken);

        User user = null;
        boolean isAccessTokenValid = false;

        // 액세스 토큰이 존재하는 경우 유효성 검사
        if (!accessToken.isBlank()) {
            Map<String, Object> payload = userAuthTokenService.payload(accessToken);
            if (payload != null) {
                // 액세스 토큰이 유효하면 사용자 정보를 추출하고 인증 상태 설정 준비
                int id = (int) payload.get("id");
                String username = (String) payload.get("username");
                String nickname = (String) payload.get("nickname"); // DTO와 일관성 유지 (nickName -> nickname)
                String role = (String) payload.get("role");
                user = new User(id, username, nickname, role);
                isAccessTokenValid = true;
                logger.debug("Access Token is valid for user: " + username);
            } else {
                logger.debug("Access Token is invalid or expired.");
            }
        }

        // 액세스 토큰이 유효하지 않거나 존재하지 않는 경우 리프레시 토큰을 사용하여 갱신 시도
        if (!isAccessTokenValid && !refreshToken.isBlank()) {
            logger.debug("Attempting to refresh Access Token using Refresh Token.");
            try {
                // 리프레시 토큰 검증 및 페이로드 추출
                Map<String, Object> refreshPayload = userAuthTokenService.payloadRefreshToken(refreshToken);

                if (refreshPayload != null) {
                    int userId = (int) refreshPayload.get("id");
                    Optional<User> userOptional = userService.findById(userId);

                    if (userOptional.isPresent()) {
                        User foundUser = userOptional.get();
                        // DB에 저장된 리프레시 토큰과 현재 리프레시 토큰이 일치하는지 확인
                        if (refreshToken.equals(foundUser.getRefreshToken())) {
                            user = foundUser; // 사용자 정보 갱신
                            String newAccessToken = userService.genAccessToken(user);
                            rq.setCookie("accessToken", newAccessToken); // 새로운 액세스 토큰 쿠키에 설정
                            rq.setHeader("Authorization", "Bearer " + newAccessToken); // 응답 헤더에도 설정 (클라이언트 즉시 사용 가능)
                            isAccessTokenValid = true; // 새로운 액세스 토큰 발급 성공
                            logger.debug("Successfully refreshed Access Token for user: " + user.getUsername());
                        } else {
                            // DB 토큰 불일치: 탈취 가능성, 모든 토큰 삭제 후 재로그인 유도
                            logger.warn("Mismatch Refresh Token for user ID: " + userId + ". Clearing cookies.");
                            rq.deleteCookie("accessToken");
                            rq.deleteCookie("refreshToken");
                            rq.deleteCookie("apiKey");
                            throw new ServiceException("401-4", "유효하지 않은 리프레시 토큰입니다. 다시 로그인 해주세요.");
                        }
                    } else {
                        // 리프레시 토큰 페이로드의 사용자 ID가 DB에 없는 경우
                        logger.warn("User not found from Refresh Token payload for ID: " + userId);
                        rq.deleteCookie("refreshToken");
                        throw new ServiceException("401-5", "리프레시 토큰이 유효하지 않습니다. 다시 로그인 해주세요.");
                    }
                } else {
                    // 리프레시 토큰 자체가 유효하지 않거나 만료된 경우
                    logger.warn("Invalid or expired Refresh Token. Clearing cookies.");
                    rq.deleteCookie("refreshToken"); // 유효하지 않거나 만료된 리프레시 토큰 삭제
                    throw new ServiceException("401-6", "리프레시 토큰이 만료되었습니다. 다시 로그인 해주세요.");
                }
            } catch (ServiceException e) {
                throw e; // 예상된 ServiceException은 상위 catch 블록에서 처리
            } catch (Exception e) {
                logger.warn("Error during Refresh Token processing: " + e.getMessage());
                rq.deleteCookie("refreshToken");
                throw new ServiceException("500-1", "토큰 갱신 중 오류가 발생했습니다.");
            }
        }

        // API 키를 사용한 인증 시도
        if (user == null && !apiKey.isBlank()) {
            logger.debug("Attempting to authenticate using API Key.");
            user = userService.findByApiKey(apiKey)
                    .orElseThrow(() -> new ServiceException("401-3", "API 키가 유효하지 않습니다."));
            logger.debug("Authenticated using API Key for user: " + user.getUsername());
        }

        // 여전히 인증된 사용자가 없다면, 인증 없이 진행
        if (user == null) {
            logger.debug("No valid authentication information found. Proceeding without authentication.");
            filterChain.doFilter(request, response);
            return;
        }

        UserDetails userDetails = new UserSecurityUser(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                userDetails.getPassword(),
                userDetails.getAuthorities()
        );

        // 이 시점 이후부터는 시큐리티가 이 요청을 "인증된 사용자의 요청"이라고 판단
        SecurityContextHolder
                .getContext()
                .setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}