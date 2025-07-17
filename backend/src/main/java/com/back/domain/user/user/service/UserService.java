package com.back.domain.user.user.service;

import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.repository.UserRepository;
import com.back.global.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserAuthTokenService userAuthTokenService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User join(String username, String rawPassword, String nickname, String email, String address, String postalCode) {
        userRepository.findByUsername(username)
                .ifPresent(u -> { throw new ServiceException("400-1", "이미 존재하는 아이디입니다."); });
        userRepository.findByEmail(email)
                .ifPresent(u -> { throw new ServiceException("400-2", "이미 사용 중인 이메일입니다."); });

        String encoded = passwordEncoder.encode(rawPassword);
        User user = new User(username, encoded, nickname, email, address, postalCode);
        return userRepository.save(user);
    }
    public String genAccessToken(User user) {
        return userAuthTokenService.genAccessToken(user);
    }

    public String genRefreshToken(User user) {
        return userAuthTokenService.genRefreshToken(user);
    }
    @Transactional
    public void updateRefreshToken(User user, String refreshToken) {
        user.updateRefreshToken(refreshToken);
        userRepository.save(user);
    }

    public Map<String, Object> verifyRefreshToken(String refreshToken) {
        Map<String, Object> payload = userAuthTokenService.payloadRefreshToken(refreshToken);
        if (payload == null) {
            throw new ServiceException("401-5", "리프레시 토큰이 유효하지 않거나 만료되었습니다.");
        }
        return payload;
    }

    @Transactional
    public void invalidateRefreshToken(User user) {
        user.updateRefreshToken(null);
        userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void checkPassword(User user, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new ServiceException("401-2", "비밀번호가 일치하지 않습니다.");
        }
    }

    public Optional<User> findById(int id) {
        return userRepository.findById(id);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    @Transactional
    public User create(String username, String rawPassword, String email, String nickname, List<String> roles, String address, String postalCode) {
        String encodedPassword = passwordEncoder.encode(rawPassword);

        String role = roles.isEmpty() ? "ROLE_USER" : roles.get(0); // 가장 첫 번째 role 사용

        User user = User.builder()
                .username(username)
                .password(encodedPassword)
                .nickname(nickname)
                .email(email)
                .address(address)
                .postalCode(postalCode)
                .role(role)
                .build();

        return userRepository.save(user);
    }

    public long count() {
        return userRepository.count();
    }

    public Optional<User> findByApiKey(String apiKey) {
        return userRepository.findByApiKey(apiKey);
    }

    @Transactional
    public void deleteUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ServiceException("404-3", "삭제하려는 회원이 존재하지 않습니다."));
        userRepository.delete(user);
    }
}
