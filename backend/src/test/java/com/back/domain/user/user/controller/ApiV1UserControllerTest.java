package com.back.domain.user.user.controller;

import com.back.domain.order.orderItem.repository.OrderItemRepository;
import com.back.domain.order.orders.repository.OrderRepository;
import com.back.domain.product.product.repository.ProductRepository;
import com.back.domain.user.user.repository.UserRepository;
import com.back.domain.user.user.service.UserService;
import com.back.domain.wishList.wishList.repository.WishListRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApiV1UserControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired private OrderRepository orderRepository; // Order Repository
    @Autowired private OrderItemRepository orderItemRepository; // OrderItem Repository
    @Autowired private ProductRepository productRepository; // Product Repository
    @Autowired private WishListRepository wishListRepository;

    @BeforeEach
    void setup() {
        wishListRepository.deleteAll();
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();
        if (userService.count() == 0) {
            userService.create("user1", "1234", "user1@test.com", List.of("ROLE_USER"), "서울시 강남구");
        }
    }

    @Test
    @DisplayName("회원가입 성공")
    void testJoinSuccess() throws Exception {
        Map<String, Object> reqBody = Map.of(
                "username", "newuser",
                "password", "1234",
                "nickname", "Newbie",
                "email", "newuser@test.com",
                "address", "서울시 서초구"
        );

        mvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andExpect(status().isCreated())  // 201 Created
                .andExpect(jsonPath("$.resultCode", anyOf(is("201"), is("201-1")))) // RsData의 필드명 맞춤
                .andExpect(jsonPath("$.msg", containsString("회원가입 완료")))
                .andExpect(jsonPath("$.data.username").value("newuser"))
                .andExpect(jsonPath("$.data.nickname").value("Newbie"));
    }

    @Test
    @DisplayName("로그인 성공")
    void testLoginSuccess() throws Exception {
        Map<String, Object> reqBody = Map.of(
                "username", "user1",
                "password", "1234"
        );

        mvc.perform(post("/api/v1/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode", anyOf(is("200"), is("200-1"))))
                .andExpect(jsonPath("$.msg", containsString("로그인 성공")))
                .andExpect(jsonPath("$.data.username").value("user1"));
    }

    @Test
    @DisplayName("내 정보 조회 성공")
    @WithUserDetails("user1")
    void testMeSuccess() throws Exception {
        mvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode", anyOf(is("200-1"), is("200"))))
                .andExpect(jsonPath("$.data.username").value("user1"));
    }

    @Test
    @DisplayName("로그아웃 성공")
    @WithMockUser(username = "user1", roles = {"USER"})
    void testLogoutSuccess() throws Exception {
        mvc.perform(delete("/api/v1/users/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode", anyOf(is("200"), is("200-1"))))
                .andExpect(jsonPath("$.msg", containsString("로그아웃")));
    }

    @Test
    @DisplayName("아이디 중복 체크")
    void testCheckUsernameAvailable() throws Exception {
        mvc.perform(get("/api/v1/users/check-username")
                        .param("username", "user1"))
                .andExpect(status().isOk())
                .andExpect(content().string("false")); // user1은 이미 존재하므로 false
    }

    @Test
    @DisplayName("이메일 중복 체크")
    void testCheckEmailAvailable() throws Exception {
        mvc.perform(get("/api/v1/users/check-email")
                        .param("email", "user1@test.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("false")); // 이미 존재하는 이메일
    }

    @Test
    @DisplayName("회원가입 실패 - 중복된 사용자명")
    void testJoinFail_DuplicateUsername() throws Exception {
        // setup()에서 user1이 생성되므로, user1으로 다시 시도
        Map<String, Object> reqBody = Map.of(
                "username", "user1", // 중복된 사용자명
                "password", "newpass",
                "nickname", "DupUser",
                "email", "dupuser@test.com",
                "address", "서울시 동작구"
        );

        mvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andExpect(status().isBadRequest()) // 400 Bad Request
                .andExpect(jsonPath("$.resultCode", is("400-0"))) // 적절한 에러 코드
                .andExpect(jsonPath("$.msg", containsString("이미 존재하는 아이디입니다."))); // 서비스에서 반환하는 메시지
    }
}