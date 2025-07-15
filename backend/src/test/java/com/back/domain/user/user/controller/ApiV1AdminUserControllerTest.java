package com.back.domain.user.user.controller;

import com.back.domain.user.user.entity.User;
import com.back.domain.user.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class ApiV1AdminUserControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private UserService userService;

    @BeforeEach
    void setUp() {
        if (userService.count() == 0) {
            userService.create("admin", "1234", "admin@test.com", List.of("ROLE_ADMIN"), "서울시 중구");
            userService.create("user1", "1234", "user1@test.com", List.of("ROLE_USER"), "서울시 강남구");
            userService.create("user2", "1234", "user2@test.com", List.of("ROLE_USER"), "서울시 서초구");
        }
    }

    @Test
    @DisplayName("관리자 - 사용자 목록 조회")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getUsers_shouldReturnList() throws Exception {
        List<User> all = userService.findAll();

        mvc.perform(get("/api/v1/adm/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(all.size()))
                .andExpect(jsonPath("$[0].username").value(all.get(0).getUsername()))
                .andExpect(jsonPath("$[0].email").value(all.get(0).getEmail()));
    }

    @Test
    @DisplayName("관리자 - 사용자 단건 조회")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getUser_shouldReturnUser() throws Exception {
        User user = userService.findByUsername("user1").get();

        mvc.perform(get("/api/v1/adm/users/" + user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(user.getId()))
                .andExpect(jsonPath("$.username").value(user.getUsername()))
                .andExpect(jsonPath("$.email").value(user.getEmail()))
                .andExpect(jsonPath("$.createDate").value(startsWith(user.getCreateDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.modifyDate").value(startsWith(user.getModifyDate().toString().substring(0, 20))))
                .andExpect(jsonPath("$.role").value(user.getRole()));
    }

    @Test
    @DisplayName("권한 없이 관리자 API 접근 시 403")
    @WithMockUser(username = "user1", roles = {"USER"})
    void forbiddenWhenUserAccessAdmin() throws Exception {
        mvc.perform(get("/api/v1/adm/users"))
                .andExpect(status().isForbidden());
    }
}