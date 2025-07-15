package com.back.domain.user.user.controller;

import com.back.domain.user.user.dto.UserWithUsernameDto;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/adm/users")
@RequiredArgsConstructor
public class ApiV1AdminUserController{
    private final UserService userService;

    @GetMapping
    public List<UserWithUsernameDto> getUsers() {
        return userService.findAll().stream()
                .map(UserWithUsernameDto::new)
                .toList();
    }

    @GetMapping("/{id}")
    public UserWithUsernameDto getUser(@PathVariable int id) {
        User user = userService.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));
        return new UserWithUsernameDto(user);
    }
}