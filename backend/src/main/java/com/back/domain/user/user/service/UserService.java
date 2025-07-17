package com.back.domain.user.user.service;

import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.repository.UserRepository;
import com.back.global.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserAuthTokenService userAuthTokenService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User join(String username, String rawPassword, String nickname, String email, String address) {
        userRepository.findByUsername(username)
                .ifPresent(u -> { throw new ServiceException("400-1", "이미 존재하는 아이디입니다."); });
        userRepository.findByEmail(email)
                .ifPresent(u -> { throw new ServiceException("400-2", "이미 사용 중인 이메일입니다."); });

        String encoded = passwordEncoder.encode(rawPassword);
        User user = new User(username, encoded, nickname, email, address);
        return userRepository.save(user);
    }
    public String genAccessToken(User user) {
        return userAuthTokenService.genAccessToken(user);
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

    public User create(String username, String rawPassword, String email, List<String> roles, String address) {
        String encodedPassword = passwordEncoder.encode(rawPassword);

        String role = roles.isEmpty() ? "ROLE_USER" : roles.get(0); // 가장 첫 번째 role 사용

        User user = User.builder()
                .username(username)
                .password(encodedPassword)
                .nickname(username)
                .email(email)
                .address(address)
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
}
