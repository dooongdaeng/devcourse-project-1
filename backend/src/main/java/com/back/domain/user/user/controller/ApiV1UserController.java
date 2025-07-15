package com.back.domain.user.user.controller;

import com.back.domain.user.user.dto.UserDto;
import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import com.back.global.rq.Rq;
import com.back.global.rsData.RsData;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
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
    public RsData<UserDto> login(@Valid @RequestBody UserLoginReqBody reqBody) {
        User user = userService.findByUsername(reqBody.username())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

        userService.checkPassword(user, reqBody.password());

        rq.login(user.getId());

        return new RsData<>("200", "로그인 성공", new UserDto(user));
    }

    @DeleteMapping("/logout")
    public RsData<Void> logout() {
        rq.logout();
        return new RsData<>("200", "로그아웃 되었습니다.");
    }

    @GetMapping("/me")
    public RsData<UserDto> me() {
        if (!rq.isLogined()) {
            return new RsData<>("401-1", "로그인이 필요합니다.");
        }

        Integer userId = rq.getLoginedUserId();

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 정보가 존재하지 않습니다."));

        return new RsData<>("200-1", "내 정보 조회 성공", new UserDto(user));
    }

}
