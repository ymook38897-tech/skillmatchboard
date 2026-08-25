# SkillMatchBoard Frontend

SkillMatchBoard의 프론트엔드로, 사용자가 음성으로 자신의 경험, 피하고 싶은 일, 관심 분야, 강점, 자격증 여부를 답하면 백엔드 API와 연동해 직무 추천까지 이어지는 흐름을 구현한 프로젝트입니다.

---

## 주요 기능

### 1. 음성 기반 5단계 질문

사용자는 마이크를 통해 다음 5개 질문에 음성으로 답변합니다:

- **C. 피하고 싶은 일이 있나요?**
- **D. 기억나는 일이 있나요?**
- **E. 해보고 싶은 일이 있나요?**
- **F. 평소에 자주 하는 일이 있나요?**
- **G. 자격증이 있으신가요?**

**녹음 동작:**
- 마이크 버튼으로 녹음 시작
- 다시 누르면 즉시 종료
- 마지막 음성 이후 5초 무음 자동 종료
- 최대 60초 녹음 제한
- MediaRecorder 기반 실시간 녹음

### 2. STT 처리 및 답변 표시

- 음성을 WebM 형식으로 녹음
- Base64로 변환하여 백엔드 전송
- Voice Answer API로 STT 처리
- 백엔드 응답의 sttText를 화면에 즉시 표시
- STT 오류 시 다시 답변할 수 있는 UI 제공

### 3. 답변 확인 및 수정

- 5개 질문(C~G) 완료 후 한 화면에서 모든 답변 확인
- 각 답변별 수정 버튼으로 해당 질문으로 돌아가기 가능
- 수정 화면에서 기존 답변 확인 가능 / 재녹음 성공 시 새로운 STT 결과로 해당 답변 갱신

### 4. 자격증 확인 (선택사항)

- 자격증 선택 화면에 진입 (현재 운영 후보 목록은 비어 있음)
- 스킵하거나 향후 자격증 정보 추가 가능하도록 설계

### 5. 직무 추천 및 선택

- Recommendation API 호출로 추천 직무 5개 수신
- 각 직무를 카드 형태로 표시
- 사용자가 최대 3개 선택 가능 (4개 이상 선택 불가)
- 선택/해제 상태 시각적으로 표시

### 6. 최종 결과

- 선택한 직무와 5개 질문의 답변을 기반으로 구직신청서 형태의 최종 화면 제공
- 1분 후 종료 안내 표시
- 2분 후 자동으로 처음 화면으로 이동
- "처음으로 돌아가기" 버튼으로 즉시 초기화 가능

---

## 사용자 Flow

```
Start (시작 화면)
  ↓
Tutorial (1/3 → 2/3 → 3/3)
  ↓
질문 C (피하고 싶은 일)
  ↓
질문 D (기억나는 일)
  ↓
질문 E (해보고 싶은 일)
  ↓
질문 F (평소에 자주 하는 일)
  ↓
질문 G (자격증)
  ↓
자격증 확인 (현재는 스킵)
  ↓
답변 확인 (수정 가능)
  ↓
직무 추천 (5개 표시)
  ↓
직무 선택 (최대 3개)
  ↓
구직신청서
  ↓
처음 화면 (1분 후 안내, 2분 후 자동 이동)
```

---

## API 연동

프론트엔드는 백엔드의 3가지 REST API와 연동합니다:

### `POST /api/sessions`

새로운 사용자 세션을 생성합니다.
- 응답: `sessionId`, 세션 만료 시간, 유휴 타임아웃 정보
- 용도: 음성 답변 저장 및 추천 요청을 위한 세션 관리

### `POST /api/sessions/{sessionId}/voice-answers`

사용자의 음성 답변을 전송하고 STT 결과를 받습니다.
- 요청: 질문 키(C~G), WebM 형식 음성(Base64 인코딩)
- 응답: `sttText`(인식된 텍스트), `status`(ok/no_speech), 신뢰도
- 용도: 각 질문별 음성 입력 처리 및 텍스트 변환

### `POST /api/sessions/{sessionId}/voice-recommendations`

해당 세션에 저장된 음성 답변을 기반으로 추천 직무를 요청합니다.
- 요청: 빈 객체 (세션의 저장된 답변 이용)
- 응답: 추천 직무 5개(id, name, easyName), `basedOnQuestions`, `total`
- 용도: 사용자의 답변을 분석하여 맞춤 직무 추천

---

## 오류 처리

프론트엔드에서 처리하는 주요 오류 상태:

| 오류 코드 | 의미 | 처리 방식 |
|---------|------|---------|
| `SESSION_NOT_FOUND` | 세션이 백엔드에 없음 | 상담 상태 초기화 후 새 세션을 생성하고 첫 질문부터 재진행 |
| `SESSION_EXPIRED` | 세션 유효 시간 초과 | 상담 상태 초기화 후 새 세션을 생성하고 첫 질문부터 재진행 |
| `MISSING_ANSWERS` | 필수 답변(D/E/F) 부족 | 누락된 첫 질문으로 돌아가 재답변 |
| `STT_FAILED` | 음성 인식 실패 | 다시 녹음 유도 |
| `STT_UNAVAILABLE` | STT 서비스를 사용할 수 없음 | 다시 녹음 유도 |
| `no_speech` | 음성이 감지되지 않음 | 다시 말하도록 안내 |

---

## Tech Stack

| 라이브러리 | 버전 | 용도 |
|----------|------|------|
| **React** | 19.2.8 | UI 라이브러리 |
| **React DOM** | 19.2.8 | React DOM 렌더링 |
| **TypeScript** | 7.0.2 | 타입 안전성 |
| **Vite** | 8.1.5 | 번들러 및 개발 서버 |
| **Tailwind CSS** | 4.3.3 | 유틸리티 CSS 프레임워크 |
| **Tailwind Animate** | 1.0.7 | 애니메이션 유틸리티 |
| **Playwright** | 1.62.1 | E2E 테스트 |
| **MediaRecorder API** | - | 음성 녹음 |
| **Web Audio API** | - | 무음 감지 및 분석 |

---

## E2E Test

Playwright 기반 E2E 테스트는 실제 Render 백엔드 API를 사용하는 통합 테스트입니다. 테스트 환경에서는 STT mock provider를 이용해 전체 API Flow를 검증합니다.

### 테스트 1: 전체 Flow (Start → Resume → 처음 화면)

Tutorial을 건너뛴 후 5개 질문(C~G) 모두 완료하고, 자격증을 스킵하고, 추천 직무 3개를 선택하여 구직신청서까지 도달한 후 처음 화면으로 복귀하는 전체 Flow를 검증합니다.

**검증 항목:**
- ✅ Tutorial 건너뛰기 정상 동작
- ✅ C~G 음성 답변 요청 (5개)
- ✅ MediaRecorder → WebM → Base64 → Voice API 경로
- ✅ 추천 직무 5개 수신 (`total: 5`)
- ✅ `basedOnQuestions: ['C', 'D', 'E', 'F', 'G']` 확인
- ✅ 직무 카드 5개 표시
- ✅ 직무 3개 선택 가능
- ✅ 구직신청서 진입
- ✅ 처음 화면으로 복귀

### 테스트 2: Tutorial Flow (1/3 → 2/3 → 3/3 → 첫 질문)

Tutorial의 3단계를 모두 진행한 후 첫 번째 질문(C)으로 자동 진입하는지 검증합니다.

**검증 항목:**
- ✅ Tutorial 1/3 표시
- ✅ Tutorial 2/3로 진행
- ✅ Tutorial 3/3까지 완료
- ✅ 첫 질문(C) 정상 로드

**테스트 결과:** 2 passed ✅

---

## 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173/` 접속

### 3. Production 빌드
```bash
npm run build
```
`dist/` 디렉토리에 최적화된 번들 생성

### 4. E2E 테스트 실행
```bash
npm run test:e2e
```
Playwright로 실제 백엔드와 연동한 테스트 실행

---

## Frontend 주요 구현 포인트

- **Figma 기반 Voice Interview UI 구현:** 와이어프레임을 기반으로 구축한 음성 인터뷰 인터페이스
- **React Hooks 기반 단계별 상태 관리:** 세션, 답변, 직무 추천 상태를 효율적으로 관리
- **MediaRecorder 기반 음성 녹음:** 실시간 음성 입력 및 제어
- **Web Audio API 기반 5초 무음 감지:** 자동 녹음 종료 구현
- **WebM → Base64 변환:** 음성 데이터를 백엔드 전송 가능한 형식으로 인코딩
- **Session/Voice Answer/Recommendation API 연동:** 3가지 백엔드 API와의 안정적인 통신
- **API 오류 및 세션 복구 처리:** 네트워크 오류, 세션 만료, STT 실패 시나리오 대응
- **답변 수정 Flow:** 완료된 답변을 다시 선택하여 재녹음 가능
- **직무 선택 제약:** 최대 3개 선택 제한으로 사용자 의도 명확화
- **Playwright E2E 테스트:** 실제 백엔드와의 통합 테스트로 End-to-End 동작 검증
- **레거시 코드 정리:** 미사용 구버전 UI, Mock 데이터, 컴포넌트, 아이콘 및 폰트 Asset 제거

---

## 프로젝트 구조

```
src/
├── components/
│   └── common/              # 공통 컴포넌트 (LoadingScreen)
├── pages/                   # 페이지 컴포넌트 (Start, Tutorial, VoiceQuestion 등)
├── services/                # API 호출 로직
│   ├── apiBase.ts          # API 기본 설정 및 에러 처리
│   ├── sessionApi.ts       # 세션 생성/관리
│   ├── voiceApi.ts         # 음성 답변 전송
│   └── recommendationApi.ts # 직무 추천
├── types/                   # TypeScript 타입 정의
├── data/                    # 정적 데이터 (질문 목록)
├── utils/                   # 유틸리티 함수 (음성 처리)
├── App.tsx                  # 메인 애플리케이션 컴포넌트
└── main.tsx                 # 엔트리 포인트

tests/
└── e2e/
    └── voice-flow.spec.ts   # Playwright E2E 테스트
```
