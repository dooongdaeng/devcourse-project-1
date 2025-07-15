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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
