# 🎵 LPWORLD

나만의 LP(바이닐 레코드)를 기록하고 공유하는 소셜 아카이브 웹 애플리케이션입니다.
LP를 등록하고, 태그로 분류하고, 다른 사용자의 LP에 좋아요와 댓글을 남길 수 있습니다.

UMC 프론트엔드 미션 프로젝트로 진행되었습니다.

## ✨ 주요 기능

- **인증** — 이메일 회원가입/로그인, Google OAuth 로그인, Access/Refresh 토큰 기반 자동 재발급
- **LP 목록** — 무한 스크롤, 최신순/오래된순 정렬
- **LP 상세** — LP 정보, 좋아요, 댓글(작성·정렬)
- **LP 작성/수정** — 썸네일 이미지 업로드, 태그 추가
- **마이페이지** — 프로필 조회 및 수정
- **보호 라우트** — 로그인 사용자만 접근 가능한 페이지 가드

## 🛠 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 코어 | React 19, TypeScript, Vite |
| 라우팅 | React Router v7 |
| 서버 상태 | TanStack Query (React Query) |
| HTTP | Axios (인터셉터로 토큰 주입/갱신) |
| 폼 | React Hook Form + Zod |
| 스타일 | Tailwind CSS v4 (커스텀 골드 테마) |
| 무한 스크롤 | react-intersection-observer |

## 🚀 시작하기

### 요구 사항

- Node.js 18+
- 백엔드 API 서버가 `http://localhost:8000/v1` 에서 실행 중이어야 합니다.

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린트
npm run lint
```

개발 서버는 기본적으로 `http://localhost:5173` 에서 열립니다.

> API 베이스 URL은 현재 [src/api/axios.ts](src/api/axios.ts) 에 `http://localhost:8000/v1` 로 설정되어 있습니다.

## 📁 프로젝트 구조

```
src/
├── api/          # axios 인스턴스, 업로드 등 API 모듈
├── components/   # 재사용 컴포넌트 (Navbar, Sidebar, 모달 등)
├── context/      # 전역 상태 (AuthContext)
├── hooks/        # 커스텀 훅 (useForm, useLocalStorage 등)
├── layout/       # RootLayout
├── pages/        # 라우트 단위 페이지
├── types/        # 타입 및 Zod 스키마 (lp, authSchema)
├── App.tsx       # 라우터 정의
└── main.tsx      # 엔트리 포인트
```

## 🧭 주요 라우트

| 경로 | 설명 | 접근 |
| --- | --- | --- |
| `/` | 홈 | 공개 |
| `/login`, `/signup` | 로그인 / 회원가입 | 공개 |
| `/v1/auth/google/callback` | Google OAuth 콜백 | 공개 |
| `/v1/lps` | LP 목록 | 공개 |
| `/lp/:lpid` | LP 상세 | 로그인 필요 |
| `/mypage` | 마이페이지 | 로그인 필요 |
