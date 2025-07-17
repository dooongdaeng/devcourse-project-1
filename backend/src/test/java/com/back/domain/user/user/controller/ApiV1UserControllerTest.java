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
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional // 각 테스트 메서드가 독립적인 트랜잭션으로 실행되도록 하여 데이터 롤백 보장
public class ApiV1UserControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private WishListRepository wishListRepository;

    @BeforeEach
    void setup() {
        // 모든 Repository의 데이터를 삭제하여 각 테스트의 독립성을 확보합니다.
        wishListRepository.deleteAll();
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();

        // `testLoginSuccess`, `testMeSuccess`, `testCheckUsernameAvailable`, `testCheckEmailAvailable`,
        // `testJoinFail_DuplicateUsername` 등에서 필요한 "user1"을 여기서 생성합니다.
        userService.create("user10", "1234", "user10@test.com", List.of("ROLE_USER"), "서울시 노원구");
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
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode", anyOf(is("201"), is("201-1"))))
                .andExpect(jsonPath("$.msg", containsString("회원가입 완료")))
                .andExpect(jsonPath("$.data.username").value("newuser"))
                .andExpect(jsonPath("$.data.nickname").value("Newbie")); // 닉네임 검증 추가
    }

    @Test
    @DisplayName("로그인 성공")
    void testLoginSuccess() throws Exception {
        Map<String, Object> reqBody = Map.of(
                "username", "user10",
                "password", "1234"
        );

        mvc.perform(post("/api/v1/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode", anyOf(is("200"), is("200-1"))))
                .andExpect(jsonPath("$.msg", containsString("로그인 성공")))
                .andExpect(jsonPath("$.data.username").value("user10"));
    }

    @Test
    @DisplayName("내 정보 조회 성공")
    // @WithUserDetails는 `setupBefore = TestExecutionEvent.TEST_EXECUTION`으로 설정하여,
    // `@BeforeEach`에서 user1이 생성된 후에 SecurityContext가 설정되도록 합니다.
    @WithUserDetails(value = "user10", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void testMeSuccess() throws Exception {
        mvc.perform(get("/api/v1/users/me"))
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode", anyOf(is("200-1"), is("200"))))
                .andExpect(jsonPath("$.data.username").value("user10"));
    }

    @Test
    @DisplayName("로그아웃 성공")
    // `@WithMockUser`는 `UserDetailsService`를 통하지 않고 Mock User를 생성하므로,
    // DB에 'user1'이 없어도 작동합니다. 하지만 `setup()`에서 `user1`을 이미 생성했으므로
    // 실제 DB에 있는 'user1'을 사용하게 됩니다.
    @WithUserDetails(value = "user10", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void testLogoutSuccess() throws Exception {
        mvc.perform(delete("/api/v1/users/logout"))
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode", anyOf(is("200"), is("200-1"))))
                .andExpect(jsonPath("$.msg", containsString("로그아웃")));
    }

    @Test
    @DisplayName("아이디 중복 체크 - 이미 존재하는 아이디")
    void testCheckUsernameAvailable() throws Exception {
        mvc.perform(get("/api/v1/users/check-username")
                        .param("username", "user10")) // `setup()`에서 생성된 "user1" 사용
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isOk())
                .andExpect(content().string("false")); // "user1"은 이미 존재하므로 `false` 반환 예상
    }

    @Test
    @DisplayName("아이디 중복 체크 - 사용 가능한 아이디")
    void testCheckUsernameAvailable_NotExists() throws Exception {
        mvc.perform(get("/api/v1/users/check-username")
                        .param("username", "totally_new_user_" + UUID.randomUUID().toString().substring(0,4)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("true")); // 존재하지 않는 아이디이므로 `true` 반환 예상
    }

    @Test
    @DisplayName("이메일 중복 체크 - 이미 존재하는 이메일")
    void testCheckEmailAvailable() throws Exception {
        mvc.perform(get("/api/v1/users/check-email")
                        .param("email", "user10@test.com")) // `setup()`에서 생성된 이메일 사용
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isOk())
                .andExpect(content().string("false")); // 이미 존재하는 이메일이므로 `false` 반환 예상
    }

    @Test
    @DisplayName("이메일 중복 체크 - 사용 가능한 이메일")
    void testCheckEmailAvailable_NotExists() throws Exception {
        mvc.perform(get("/api/v1/users/check-email")
                        .param("email", "totally_new_email_" + UUID.randomUUID().toString().substring(0,4) + "@test.com"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("true")); // 존재하지 않는 이메일이므로 `true` 반환 예상
    }

    @Test
    @DisplayName("회원가입 실패 - 중복된 사용자명")
    void testJoinFail_DuplicateUsername() throws Exception {
        // `setup()`에서 "user1"이 생성되므로, "user1"으로 다시 시도하여 중복 오류 유도
        Map<String, Object> reqBody = Map.of(
                "username", "user10", // 중복된 사용자명
                "password", "newpass",
                "nickname", "DupUser",
                "email", "dupuser@test.com", // 고유한 이메일 사용
                "address", "서울시 동작구"
        );

        mvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isBadRequest()) // 400 Bad Request
                .andExpect(jsonPath("$.resultCode", is("400-1")))
                .andExpect(jsonPath("$.msg", containsString("이미 존재하는 아이디입니다.")));
    }

    @Test
    @DisplayName("회원가입 실패 - 필수 필드 누락 (username)")
    void testJoinFail_MissingUsername() throws Exception {
        Map<String, Object> reqBody = Map.of(
                // "username", "missingfield", // username 필드 누락
                "password", "1234",
                "nickname", "Missing",
                "email", "missing@test.com",
                "address", "서울시 강남구"
        );

        mvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andDo(print())
                .andExpect(status().isBadRequest()) // 400 Bad Request
                .andExpect(jsonPath("$.resultCode", anyOf(is("400-0"), is("400-1")))) // 유효성 검증 실패 에러 코드
                .andExpect(jsonPath("$.msg", containsString("username"))); // "username" 필드 관련 에러 메시지 포함 확인
    }

    @Test
    @DisplayName("회원가입 실패 - 필수 필드 누락 (password)")
    void testJoinFail_MissingPassword() throws Exception {
        Map<String, Object> reqBody = Map.of(
                "username", "nopass",
                // "password", "1234", // password 필드 누락
                "nickname", "NoPass",
                "email", "nopass@test.com",
                "address", "서울시 강남구"
        );

        mvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode", anyOf(is("400-0"), is("400-1"))))
                .andExpect(jsonPath("$.msg", containsString("password")));
    }

    @Test
    @DisplayName("회원가입 실패 - 필수 필드 누락 (email)")
    void testJoinFail_MissingEmail() throws Exception {
        Map<String, Object> reqBody = Map.of(
                "username", "noemail",
                "password", "1234",
                "nickname", "NoEmail",
                // "email", "noemail@test.com", // email 필드 누락
                "address", "서울시 강남구"
        );

        mvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode", anyOf(is("400-0"), is("400-1"))))
                .andExpect(jsonPath("$.msg", containsString("email")));
    }

    @Test
    @DisplayName("로그인 실패 - 잘못된 비밀번호")
    void testLoginFail_BadCredentials() throws Exception {
        Map<String, Object> reqBody = Map.of(
                "username", "user10", // 'user10' 사용
                "password", "wrongpassword" // 잘못된 비밀번호
        );

        mvc.perform(post("/api/v1/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.resultCode", is("401-2")))
                .andExpect(jsonPath("$.msg", containsString("비밀번호가 일치하지 않습니다.")));
    }

    @Test
    @DisplayName("로그인 실패 - 존재하지 않는 사용자명")
    void testLoginFail_UsernameNotFound() throws Exception {
        Map<String, Object> reqBody = Map.of(
                "username", "nonexistentuser", // 존재하지 않는 사용자명
                "password", "1234"
        );

        mvc.perform(post("/api/v1/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody))
                )
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.resultCode", is("401-1")))
                .andExpect(jsonPath("$.msg", containsString("존재하지 않는 아이디입니다.")));
    }

    @Test
    @DisplayName("내 정보 조회 실패 - 비인증 (로그인 필요)")
    void testMeFail_Unauthorized() throws Exception {
        mvc.perform(get("/api/v1/users/me"))
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.resultCode", is("401-1")))
                .andExpect(jsonPath("$.msg", containsString("로그인 후 이용해주세요."))); // 또는 "로그인이 필요합니다." 등
    }

    @Test
    @DisplayName("로그아웃 실패 - 비인증 (로그인 필요)")
    void testLogoutFail_Unauthorized() throws Exception {
        mvc.perform(delete("/api/v1/users/logout"))
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.resultCode", is("401-1")))
                .andExpect(jsonPath("$.msg", containsString("로그인 후 이용해주세요."))); // 또는 "로그인이 필요합니다." 등
    }

}