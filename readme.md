# NBE6-8-1-TEAM04
프로그래머스 백엔드 데브코스 6기 8회차 4팀 1차 프로젝트입니다.

### 프로젝트 소개
- 프로젝트 명 : 카페 메뉴 관리 서비스 제작
- 프로젝트 기간 : 2025.07.14 - 2025.07.22
- 한줄 소개 : Spring을 이용해 커피 메뉴 데이터를 관리하는 4가지 로직 CRUD를 구현하는 프로젝트

### 팀원 소개
- 팀명 : 4Byte

| 김태형 | 김영건 | 방은찬 | 배희강 | 최승욱 |
|:------:|:-----:|:------:|:-----:|:-----:|
|![김태형](https://github.com/dooongdaeng.png)|![김영건](https://github.com/johnbosco0414.png)|![방은찬](https://github.com/eunchan96.png)|![배희강](https://github.com/HeegangBae.png)|![최승욱](https://github.com/seungwookc97.png)|
|[@dooongdaeng](https://github.com/dooongdaeng)|[@johnbosco0414](https://github.com/johnbosco0414)|[@eunchan96](https://github.com/eunchan96)|[@HeegangBae](https://github.com/HeegangBae)|[@seungwookc97](https://github.com/seungwookc97)|
| 팀장<br>주문 및 주문 항목 데이터 관리 | 프론트엔드<br>UI 작업 | 상품 및 상품 이미지<br>데이터 관리 | 사용자 관리 및<br>인증 시스템 설계 | 위시리스트 데이터 관리 |


# 프로젝트 소개
### 주요기능
- 주문 기능
  - 제품 목록 및 제품 상세 페이지에서 제품 확인
  - 주문 페이지에서 제품 주문
  - 주문 내역 확인
- 회원 관리
  - 회원가입, 로그인 기능
  - 내 정보 확인
  - 관리자용 기능 : 회원 관리(삭제), 상품 관리(생성·삭제·수정), 주문 관리(삭제·수정)


### ERD
<img width="1056" height="778" alt="image" src="https://github.com/user-attachments/assets/894c97ac-34de-4c11-83a1-732528b02634" />

### 아키텍처
<img width="1109" height="784" alt="image" src="https://github.com/user-attachments/assets/8f24a5a6-c563-4cbc-a07e-4b94a358a1fb" />

### APIs
<details>
<summary>백엔드 API 명세 - localhost:8080</summary>


<details>
<summary>HomeController</summary>
  
| 기능 | 메서드 | URL |
|------|--------|-----|
| Home 화면 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | / |

</details>
<details>
<summary>ProductController</summary>
  
| 기능 | 메서드 | URL |
|------|--------|-----|
| 상품 다건조회 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/products |
| 상품 단건조회 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/products/{id} |
| 상품 생성 (관리자용) | ![POST](https://img.shields.io/badge/POST-007bff?style=flat-square&logo=none&labelColor=007bff&color=white) | /api/v1/adm/products |
| 상품 삭제 (관리자용) | ![DELETE](https://img.shields.io/badge/DELETE-dc3545?style=flat-square&logo=none&labelColor=dc3545&color=white) | /api/v1/adm/products/{id} |
| 상품 수정 (관리자용) | ![PUT](https://img.shields.io/badge/PUT-ffc107?style=flat-square&logo=none&labelColor=ffc107&color=white) | /api/v1/adm/products/{id} |

</details>
<details>
<summary>ProductImageController</summary>

| 기능 | 메서드 | URL |
|------|--------|-----|
| 상품이미지 다건조회 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/products/{productId}/images |
| 상품이미지 단건조회 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/products/{productId}/images/{id} |
| 상품이미지 생성 (관리자용) | ![POST](https://img.shields.io/badge/POST-007bff?style=flat-square&logo=none&labelColor=007bff&color=white) | /api/v1/adm/products/{productId}/images |
| 상품이미지 삭제 (관리자용) | ![DELETE](https://img.shields.io/badge/DELETE-dc3545?style=flat-square&logo=none&labelColor=dc3545&color=white) | /api/v1/adm/products/{productId}/images/{id} |
| 상품이미지 수정 (관리자용) | ![PUT](https://img.shields.io/badge/PUT-ffc107?style=flat-square&logo=none&labelColor=ffc107&color=white) | /api/v1/adm/products/{productId}/images/{id} |

</details>
<details>
<summary>OrderController</summary>

| 기능 | 메서드 | URL |
|------|--------|-----|
| 주문 생성 | ![POST](https://img.shields.io/badge/POST-007bff?style=flat-square&logo=none&labelColor=007bff&color=white) | /api/v1/orders |
| 주문 삭제 | ![DELETE](https://img.shields.io/badge/DELETE-dc3545?style=flat-square&logo=none&labelColor=dc3545&color=white) | /api/v1/orders/{id} |
| 주문 수정 | ![PUT](https://img.shields.io/badge/PUT-ffc107?style=flat-square&logo=none&labelColor=ffc107&color=white) | /api/v1/orders/{id} |
| 내 주문 목록 조회 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/orders/my |
| 주문 다건조회 (관리자용) | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/adm/orders |
| 주문 단건조회 (관리자용) | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/adm/orders/{id} |
| 주문 수정 (관리자용) | ![PUT](https://img.shields.io/badge/PUT-ffc107?style=flat-square&logo=none&labelColor=ffc107&color=white) | /api/v1/adm/orders/{id} |
| 주문 삭제 (관리자용) | ![DELETE](https://img.shields.io/badge/DELETE-dc3545?style=flat-square&logo=none&labelColor=dc3545&color=white) | /api/v1/adm/orders/{id} |
| 특정 사용자의 주문 목록 조회 (관리자용) | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/adm/orders/user/{userId} |

</details>
<details>
<summary>OrderItemController</summary>

| 기능 | 메서드 | URL |
|------|--------|-----|
| 주문 아이템 생성 | ![POST](https://img.shields.io/badge/POST-007bff?style=flat-square&logo=none&labelColor=007bff&color=white) | /api/v1/orderItems |
| 주문 아이템 삭제 | ![DELETE](https://img.shields.io/badge/DELETE-dc3545?style=flat-square&logo=none&labelColor=dc3545&color=white) | /api/v1/orderItems/{id} |
| 주문 아이템 수정 | ![PUT](https://img.shields.io/badge/PUT-ffc107?style=flat-square&logo=none&labelColor=ffc107&color=white) | /api/v1/orderItems/{id} |
| 특정 주문의 아이템 목록 조회  | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/orderItems/order/{orderId} |
| 주문 아이템 다건조회 (관리자용) | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/adm/orderItems |
| 주문 아이템 단건조회 (관리자용) | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/adm/orderItems/{id} |
| 주문 아이템 삭제 (관리자용) | ![DELETE](https://img.shields.io/badge/DELETE-dc3545?style=flat-square&logo=none&labelColor=dc3545&color=white) | /api/v1/adm/orderItems/{id} |
| 주문 아이템 수정 (관리자용) | ![PUT](https://img.shields.io/badge/PUT-ffc107?style=flat-square&logo=none&labelColor=ffc107&color=white) | /api/v1/adm/orderItems/{id} |
| 특정 상품의 주문 아이템 목록 조회 (관리자용) | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/adm/orderItems/product/{productId} |

</details>
<details>
<summary>WishListController</summary>

| 기능 | 메서드 | URL |
|------|--------|-----|
| 위시리스트 다건조회 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/wish-lists |
| 위시리스트 토글(추가/삭제) | ![POST](https://img.shields.io/badge/POST-007bff?style=flat-square&logo=none&labelColor=007bff&color=white) | /api/v1/wish-lists/toggle |
| 위시리스트 상품 존재 여부 확인| ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/wish-lists/{productId} |
| 위시리스트에서 상품 삭제 | ![DELETE](https://img.shields.io/badge/DELETE-dc3545?style=flat-square&logo=none&labelColor=dc3545&color=white) | /api/v1/wish-lists/{productId} |

</details>
<details>
<summary>UserController</summary>

| 기능 | 메서드 | URL |
|------|--------|-----|
| 회원가입 | ![POST](https://img.shields.io/badge/POST-007bff?style=flat-square&logo=none&labelColor=007bff&color=white) | /api/v1/users/signup |
| 로그인 | ![POST](https://img.shields.io/badge/POST-007bff?style=flat-square&logo=none&labelColor=007bff&color=white) | /api/v1/users/login |
| 로그아웃 | ![DELETE](https://img.shields.io/badge/DELETE-dc3545?style=flat-square&logo=none&labelColor=dc3545&color=white) | /api/v1/users/logout |
| 액세스 토큰 갱신 | ![POST](https://img.shields.io/badge/POST-007bff?style=flat-square&logo=none&labelColor=007bff&color=white) | /api/v1/users/token/refresh |
| 내 정보 조회 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/users/me |
| 사용자명 중복 확인 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/users/check-username |
| 이메일 중복 확인 | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/users/check-email |
| 사용자 다건조회 (관리자용) | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/adm/users |
| 사용자 단건조회 (관리자용) | ![GET](https://img.shields.io/badge/GET-28a745?style=flat-square&logo=none&labelColor=28a745&color=white) | /api/v1/adm/users/{id} |
| 사용자 삭제 (관리자용) | ![DELETE](https://img.shields.io/badge/DELETE-dc3545?style=flat-square&logo=none&labelColor=dc3545&color=white) | /api/v1/adm/users/{id} |

</details>
</details>
<details>
<summary>프론트엔드  - localhost:3000</summary>

| 기능 | URL |
|------|-----|
| Home 화면 | / |
| 제품 소개 | /products |
| 제품 상세 | /products/detail/{id} |
| 주문 | /order |
| 주문 (비회원) | /order/guest |
| 주문 내역 | /orderHistory |
| 로그인 | /login |
| 회원가입 | /signup |
| 회원 정보 | /account/client |
| 회원 관리 (관리자용) | /account/admin/accountManagement |
| 상품 관리 (관리자용) | /account/admin/productManagement |
| 주문 관리 (관리자용) | /account/admin/orderManagement |

</details>

### 기술 스택
| 분류 | 기술 |
|------|------|
| **Language** | ![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)|
| **Framework & Build Tool** | ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white) |
| **Persistence** | ![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-59666C?style=for-the-badge&logo=spring&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![H2 Database](https://img.shields.io/badge/H2-4479A1?style=for-the-badge&logo=databricks&logoColor=white) |
| **Architecture & Docs** | ![REST API](https://img.shields.io/badge/REST%20API-000000?style=for-the-badge&logo=fastapi&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) |
| **Dev Tools** | ![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=for-the-badge&logo=intellijidea&logoColor=white) ![Cursor](https://img.shields.io/badge/Cursor-333333?style=for-the-badge&logo=cursor&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) |


### 프로젝트 실행
1. 프로젝트 클론
```bash
git clone [레포지토리 URL]
cd [프로젝트 폴더]
```

2. 백엔드 실행
```bash
cd backend
./gradlew bootRun  # 또는 IntelliJ로 열어 main 메서드 실행
```

3. 프론트엔드 실행
```bash
cd frontend
npm install  # 최초 1회만 필요
npm run dev  # http://localhost:3000 에서 확인 가능
```

※ 확인사항
- `frontend/package.json`의 `dependencies`에 `framer-motion`이 없으면 설치
```bash
npm install framer-motion
```
