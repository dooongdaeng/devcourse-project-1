package com.back.domain.user.user.controller;

import com.back.domain.user.user.dto.UserDto;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.global.rq.Rq;
import com.back.global.rsData.RsData;
import com.back.global.security.UserSecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "사용자 API")
public class ApiV1UserController {
    private final UserService userService;
    private final Rq rq;

    record UserJoinReqBody(
            @NotBlank @Size(min = 2, max = 30) String username,
            @NotBlank @Size(min = 2, max = 30) String password,
            @NotBlank @Size(min = 2, max = 30) String nickname,
            @NotBlank String email,
            @NotBlank String address
    ) {}

    @PostMapping
    @Operation(summary = "회원가입")
    public RsData<UserDto> join(@Valid @RequestBody UserJoinReqBody reqBody) {
        User user = userService.join(
                reqBody.username(),
                reqBody.password(),
                reqBody.nickname(),
                reqBody.email(),
                reqBody.address()
        );

        return new RsData<>("201", "회원가입 완료", new UserDto(user));
    }

    record UserLoginReqBody(
            @NotBlank @Size(min = 2, max = 30) String username,
            @NotBlank @Size(min = 2, max = 30) String password
    ) {}

    @PostMapping("/login")
    @Operation(summary = "로그인")
    public RsData<UserDto> login(@Valid @RequestBody UserLoginReqBody reqBody) {
        User user = userService.findByUsername(reqBody.username())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

        userService.checkPassword(user, reqBody.password());

        // JWT accessToken 생성
        String accessToken = userService.genAccessToken(user);

        // JWT, apiKey 쿠키 세팅
        rq.setCookie("accessToken", accessToken);
        rq.setCookie("apiKey", user.getApiKey());

        return new RsData<>("200", "로그인 성공", new UserDto(user));
    }

    @DeleteMapping("/logout")
    @Operation(summary = "로그아웃")
    public RsData<Void> logout() {

        rq.deleteCookie("accessToken");
        rq.deleteCookie("apiKey");

        return new RsData<>("200", "로그아웃 되었습니다.");
    }

    @GetMapping("/me")
    @Operation(summary = "내 정보 조회")
    @SecurityRequirement(name = "bearerAuth")
    // @AuthenticationPrincipal 어노테이션을 사용하여 로그인된 사용자 정보 주입
    public RsData<UserDto> me(@AuthenticationPrincipal UserSecurityUser userSecurityUser) {

        // @AuthenticationPrincipal로 주입된 UserSecurityUser 객체에서 사용자 정보 가져옴
        if (userSecurityUser == null) {
            return new RsData<>("401-1", "로그인이 필요합니다."); // JWT가 없거나 유효하지 않을 경우
        }
        int userId = userSecurityUser.getId(); // UserSecurityUser에서 ID 가져오기

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 정보가 존재하지 않습니다."));

        return new RsData<>("200-1", "내 정보 조회 성공", new UserDto(user));
    }

    @GetMapping("/check-username")
    @Operation(summary = "사용자명 중복 확인")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        boolean isAvailable = userService.isUsernameAvailable(username);
        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping("/check-email")
    @Operation(summary = "이메일 중복 확인")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean isAvailable = userService.isEmailAvailable(email);
        return ResponseEntity.ok(isAvailable);
    }

}
