package com.back.domain.user.user.service;

import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User join(String username, String rawPassword, String nickname, String email, String address) {
        userRepository.findByUsername(username)
                .ifPresent(u -> { throw new RuntimeException("이미 존재하는 아이디입니다."); });

        String encoded = passwordEncoder.encode(rawPassword);
        User user = new User(username, encoded, nickname, email, address);
        return userRepository.save(user);
    }

    public User login(String username, String rawPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }
        return user;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void checkPassword(User user, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
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

    public User create(String username, String rawPassword, String email, List<String> roles) {
        String encodedPassword = passwordEncoder.encode(rawPassword);

        String role = roles.isEmpty() ? "ROLE_USER" : roles.get(0); // 가장 첫 번째 role 사용

        User user = User.builder()
                .username(username)
                .password(encodedPassword)
                .nickname(username)
                .email(email)
                .address("서울시 강남구")
                .role(role)
                .build();

        return userRepository.save(user);
    }

    public long count() {
        return userRepository.count();
    }
}
