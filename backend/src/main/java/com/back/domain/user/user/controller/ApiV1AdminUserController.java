package com.back.domain.user.user.controller;

import com.back.domain.user.user.dto.AdminUserDto;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.global.exception.ServiceException;
import com.back.global.rsData.RsData; // RsData 임포트가 반드시 있어야 합니다.
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 이 어노테이션이 있는지 확인
@RequestMapping("/api/v1/adm/users") // 이 경로가 정확한지 확인
@RequiredArgsConstructor
@Tag(name = "관리자 유저 API")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class ApiV1AdminUserController {
    private final UserService userService;

    @GetMapping // 이 어노테이션이 있는지 확인
    @Operation(summary = "모든 사용자 정보 조회 (관리자)")
    public RsData<List<AdminUserDto>> getUsers() {
        List<AdminUserDto> users = userService.findAll().stream()
                .map(AdminUserDto::new)
                .toList();
        return new RsData<>("200", "모든 사용자 정보 조회 성공", users);
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
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}