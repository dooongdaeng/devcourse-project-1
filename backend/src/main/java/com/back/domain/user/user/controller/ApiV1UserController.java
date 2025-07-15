package com.back.domain.user.user.controller;

import com.back.domain.user.user.service.UserService;
import com.back.global.rq.Rq;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class ApiV1UserController {
    private final UserService userService;
    private final Rq rq;
}
