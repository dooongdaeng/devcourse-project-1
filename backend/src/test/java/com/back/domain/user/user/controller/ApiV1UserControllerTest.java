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
import org.springframework.security.test.context.support.WithUserDetails; // WithUserDetails 사용 유지
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print; // print() 추가

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
        // `@Transactional`이 있어도, 각 테스트 시작 전 데이터 클린업은 좋은 습관입니다.
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
    // 만약 `@WithUserDetails`로도 충분하다면 통일하는 것을 고려할 수 있습니다.
    @WithUserDetails(value = "user10", setupBefore = TestExecutionEvent.TEST_EXECUTION) // WithMockUser 대신 WithUserDetails 사용
    void testLogoutSuccess() throws Exception {
        mvc.perform(delete("/api/v1/users/logout"))
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode", anyOf(is("200"), is("200-1"))))
                .andExpect(jsonPath("$.msg", containsString("로그아웃")));
    }

    @Test
    @DisplayName("아이디 중복 체크")
    void testCheckUsernameAvailable() throws Exception {
        mvc.perform(get("/api/v1/users/check-username")
                        .param("username", "user10")) // `setup()`에서 생성된 "user1" 사용
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isOk())
                .andExpect(content().string("false")); // "user1"은 이미 존재하므로 `false` 반환 예상
    }

    @Test
    @DisplayName("이메일 중복 체크")
    void testCheckEmailAvailable() throws Exception {
        mvc.perform(get("/api/v1/users/check-email")
                        .param("email", "user10@test.com")) // `setup()`에서 생성된 이메일 사용
                .andDo(print()) // 요청/응답 내용 출력
                .andExpect(status().isOk())
                .andExpect(content().string("false")); // 이미 존재하는 이메일이므로 `false` 반환 예상
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
                .andExpect(jsonPath("$.resultCode", is("400-0"))) // 적절한 에러 코드 (예상 결과에 따라 수정)
                .andExpect(jsonPath("$.msg", containsString("이미 존재하는 아이디입니다."))); // 서비스에서 반환하는 메시지
    }
}