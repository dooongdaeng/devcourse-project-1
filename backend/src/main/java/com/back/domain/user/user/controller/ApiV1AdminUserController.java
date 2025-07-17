package com.back.domain.user.user.controller;

import com.back.domain.user.user.dto.AdminUserDto;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.global.exception.ServiceException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/adm/users")
@RequiredArgsConstructor
@Tag(name = "관리자 유저 API")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class ApiV1AdminUserController {
    private final UserService userService;

    @GetMapping
    @Operation(summary = "모든 사용자 정보 조회 (관리자)")
    public List<AdminUserDto> getUsers() {
        return userService.findAll().stream()
                .map(AdminUserDto::new)
                .toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "특정 사용자 정보 조회 (관리자)")
    public AdminUserDto getUser(@PathVariable int id) {
        User user = userService.findById(id)
                .orElseThrow(() -> new ServiceException("401-1", "존재하지 않는 회원입니다."));
        return new AdminUserDto(user);
    }
}