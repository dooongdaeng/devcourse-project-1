package com.back.domain.user.user.controller;

import com.back.domain.user.user.dto.AdminUserDto;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.global.exception.ServiceException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/{id}")
    @Operation(summary = "특정 사용자 삭제 (관리자)")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 성공적인 삭제에 대해 204 No Content 반환
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build(); // 204 No Content 반환
    }
}