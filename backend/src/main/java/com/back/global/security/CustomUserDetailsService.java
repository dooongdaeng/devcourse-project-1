package com.back.global.security;

import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService; // User 엔티티를 찾기 위한 서비스
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService; // 사용자 정보를 조회하는 서비스

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));

        // 찾은 User 엔티티로 UserSecurityUser 객체를 생성하여 반환
        return new UserSecurityUser(user);
    }
}