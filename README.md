# SkillMatchBoard Frontend

음성 기반 직무 추천 키오스크의 프론트엔드입니다. 사용자가 마이크로 5개 질문에 음성으로 답하면, 백엔드 API와 연동해 직무 추천까지 이어지는 웹 애플리케이션입니다.

---

## 주요 기능

### 1. 음성 기반 5단계 질문

사용자는 마이크로 다음 5개 질문에 음성으로 답변합니다:

| 질문 | 내용 |
|-----|-----|
| **C** | 피하고 싶은 일이 있나요? |
| **D** | 기억나는 일이 있나요? |
| **E** | 해보고 싶은 일이 있나요? |
| **F** | 평소에 자주 하는 일이 있나요? |
| **G** | 자격증이 있으신가요? |

**음성 녹음 동작:**
- 마이크 버튼 누르면 녹음 시작
- 다시 누르면 즉시 종료
- 마지막 음성 이후 5초 동안 무음 감지 시 자동 종료
- 최대 60초 녹음 제한
- MediaRecorder API (WebM/Opus 코덱) 기반 실시간 녹음
- Web Audio API로 음성 에너지 분석해 무음 감지

### 2. STT 처리 및 답변 표시

- 음성을 WebM 형식으로 녹음
- Base64로 인코딩해 백엔드 전송
- Voice Answer API로 STT 처리
- 백엔드 응답의 `sttText`를 화면에 즉시 표시
- STT 오류(`no_speech`) 시 다시 답변할 수 있는 UI 제공
- 처리 중(`processing`) 상태에서 중복 입력 방지

### 3. 자격증 후보 매칭 및 선택

**G 질문 응답 후:**
- 백엔드가 STT 텍스트에서 자격증 키워드 추출
- 카탈로그 매칭 결과 `matchedCertifications` 배열 반환
- 프론트에서 파싱해 자격증 후보 리스트 표시
- 사용자가 최대 1개 선택 또는 "안 고르기"로 건너뜀
- 선택 또는 건너뜀 상태가 AnswerReview에 반영
- G 답변 수정 시 새로운 후보 목록으로 갱신 (이전 선택이 새 후보에 없으면 자동 초기화)

**자격증 후보 한계:**
- STT 결과의 정식 자격증명 포함 여부에 따라 매칭됨
- 예: "지게차운전기능사"는 매칭되지만 "지게차 자격증" 같이 축약하면 미스 가능
- 백엔드 카탈로그에 없는 자격증은 `matchedCertifications = []` (정상)
- 자격증 후보는 직무 추천 점수에는 현재 반영하지 않음

### 4. 답변 확인 및 수정

- 5개 질문 완료 후 한 화면에서 모든 답변 확인
- 각 답변별 "수정" 버튼으로 해당 질문으로 돌아가기
- 수정 화면에서 기존 STT 텍스트 확인 가능
- 재녹음 성공 시 새로운 STT 결과로 갱신
- 수정 중 자격증 선택 상태 갱신 처리

### 5. 직무 추천 및 선택

- Recommendation API 호출로 추천 직무 5개 수신
- 각 직무를 카드 형태로 표시 (직무명, 설명, 추천 이유)
- 사용자가 최대 3개 선택 가능 (4개 이상 선택 불가)
- 선택/해제 상태 시각적으로 표시
- 최소 1개 선택 후 다음 단계 진입 가능

### 6. 최종 결과 - 구직신청서

- 선택한 최대 3개 직무와 5개 질문 답변을 기반으로 구직신청서 형태 화면
- 1분 후 종료 안내 팝업 표시
- 2분 후 자동으로 시작 화면으로 이동
- "처음으로 돌아가기" 버튼으로 즉시 초기화 가능

---

## 사용자 Flow

```
Start (시작 화면)
  ↓
Tutorial (1/3 → 2/3 → 3/3)
  ↓
음성 질문 C (피하고 싶은 일)
  ↓
음성 질문 D (기억나는 일)
  ↓
음성 질문 E (해보고 싶은 일)
  ↓
음성 질문 F (평소에 자주 하는 일)
  ↓
음성 질문 G (자격증)
  ↓
자격증 선택 (후보 있음) 또는 건너뜀 (후보 없음)
  ↓
답변 확인/수정
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

### 핵심 API (현재 UI 기본 Flow)

#### `POST /api/sessions`
새로운 사용자 세션을 생성합니다.
- **응답:** `sessionId`, 생성/만료 시간, 타임아웃 정보
- **용도:** 음성 답변 저장 및 추천 요청을 위한 세션 관리
- **호출 시점:** Tutorial 완료 후, 첫 질문 진입 전
- **타임아웃:** 120초

#### `POST /api/sessions/{sessionId}/voice-answers`
사용자의 음성 답변을 전송하고 STT 결과를 받습니다.
- **요청:** 질문 키(C~G), WebM 형식 음성(Base64 인코딩), 샘플레이트, 재생 시간
- **응답:**
  ```
  {
    sessionId: string,
    questionKey: string,
    status: 'ok' | 'no_speech',
    sttText?: string,        // status='ok'일 때 필수, 'no_speech'일 때 없음
    keywords?: string[],
    confidence?: number,
    answeredAt?: ISO8601,
    matchedCertifications?: [
      { code: string, name: string, grade?: string, kind?: string },
      ...
    ]
  }
  ```
  - C/D/E/F: `matchedCertifications = []` (항상 빈 배열)
  - G: 자격증 카탈로그 매칭 결과 포함 (배열 비어있을 수 있음)
  - status='no_speech': sttText/confidence 없을 수 있음
- **용도:** 각 질문별 음성 입력 처리 및 STT 변환
- **타임아웃:** 120초

#### `POST /api/sessions/{sessionId}/voice-recommendations`
저장된 음성 답변을 기반으로 추천 직무를 요청합니다.
- **요청:** 빈 객체 (세션의 저장된 답변 이용)
- **응답:** 추천 직무 5개 + 기반 질문/생성 시간/유효성 정보
- **용도:** 사용자의 답변을 분석하여 맞춤 직무 추천
- **타임아웃:** 120초

### 자격증 API (서비스 구현 / 현재 주 Flow 미사용)

**주의:** 현재 자격증 후보는 주로 G voice-answer 응답의 `matchedCertifications`에서 옵니다. 아래 API는 서비스 계층에 구현되어 있으나 현재 UI Flow에서는 직접 호출되지 않습니다.

#### `GET /api/certifications`
자격증 카탈로그 조회 (검색/필터 포함)
- **쿼리 파라미터:**
  - `query`: 자격증명 검색
  - `fieldGroup`: 분야 그룹 필터
  - `grade`: 등급 필터
  - `limit`: 페이지 크기
  - `offset`: 오프셋
- **응답:** 자격증 목록 (certCode, certName, grade, fieldGroup 등)
- **타임아웃:** 30초
- **상태:** 서비스 구현 완료 / 향후 전체 검색 UI 추가 시 사용 가능

#### `GET /api/certifications/{certCode}`
자격증 상세 정보 조회
- **응답:** 자격증 정보 + `linkedJobs` (해당 자격증과 연결된 직무)
- **타임아웃:** 30초
- **상태:** 서비스 구현 완료 / 현재 미사용

---

## 상태 및 오류 처리

### 오류 코드

| HTTP | errorCode | 의미 | 처리 |
|------|-----------|------|------|
| 400 | `VALIDATION_ERROR` | 요청 형식 오류 | API 호출 재검토 |
| 400 | `INVALID_QUESTION_KEY` | 잘못된 질문 키 | API 호출 재검토 |
| 400 | `MISSING_ANSWERS` | 필수 답변 부족 | 누락된 첫 질문으로 이동 |
| 404 | `SESSION_NOT_FOUND` | 세션 없음 | 상태 초기화 → 새 세션 생성 → 첫 질문부터 재진행 |
| 410 | `SESSION_EXPIRED` | 세션 만료 (타임아웃/유효기간) | 상태 초기화 → 새 세션 생성 → 첫 질문부터 재진행 |
| 413 | `AUDIO_TOO_LONG` | 60초 초과 | 사용자에게 다시 말하도록 안내 |
| 415 | `UNSUPPORTED_AUDIO_FORMAT` | 음성 형식 미지원 | 다시 녹음 유도 |
| 502 | `STT_FAILED` | STT 서버 오류 | 다시 말하도록 안내 |
| 503 | `STT_UNAVAILABLE` | STT 서비스 미설정 | 다시 말하도록 안내 |

### 세션 관리

- 세션 생성: Tutorial 완료 후 자동 생성
- 세션 타임아웃: 유휴 120초 또는 최대 1200초
- 세션 복구: SESSION_NOT_FOUND/SESSION_EXPIRED 시 상태 전체 초기화 후 재생성
- 필수 답변: D, E, F 세 개는 추천 단계에서 필수 (C, G는 선택)

### 음성 처리

- `recording`: 녹음 진행 중
- `processing`: STT 처리 대기 중
- `success`: STT 결과 수신 완료
- `error`: 음성 인식 실패 또는 네트워크 오류
- `no_speech`: 음성 감지 안 됨 (재시도)
- `microphone-error`: 마이크 접근 오류

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
| **Web Audio API** | - | 무음 감지 및 음성 에너지 분석 |

---

## 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:
```
VITE_API_BASE_URL=https://job-db-api.onrender.com
```

또는 `.env.example` 참고:
```bash
cp .env.example .env.local
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173/` 접속

### 4. Production 빌드
```bash
npm run build
```
`dist/` 디렉토리에 최적화된 번들 생성

### 5. E2E 테스트 실행
```bash
npm run test:e2e
```
Playwright 기반 자동화 테스트 실행

---

## E2E / Layout Test

### 테스트 구성
- **파일:** `tests/e2e/voice-flow.spec.ts`, `tests/e2e/layout-800x1280.spec.ts`
- **Framework:** Playwright
- **대상:** 실제 Render 백엔드 API 연동

### 통과 테스트 (4개)

1. **800x1280 Layout Regression Test**
   - viewport: 800x1280
   - 레이아웃 검증: 스크롤 없음, footer overlap 없음, hidden overflow 없음
   - 모든 요소가 viewport 내에 배치되는지 확인

2. **Tutorial 전체 Flow**
   - Tutorial 1/3 → 2/3 → 3/3 진행
   - 3/3 완료 후 첫 질문(C)으로 자동 진입

3. **5초 무음 감지**
   - 녹음 시작 후 5초 동안 음성 없음
   - STT 요청 없이 자동 종료, "다시 말하기" 안내

4. **세션 생성 실패 후 재시도**
   - 세션 생성 실패 시나리오
   - Tutorial에서 재시도 가능성 검증

### 미통과 테스트 (1개)

**전체 Flow (Tutorial skip → Resume → Start)**

```
Expected: status='ok', confidence=0.99
Actual: status='no_speech', confidence=null (C 질문)
```

**원인 분석:**
- 현재 Render STT가 fake microphone fixture의 C 질문 입력을 `no_speech`로 처리
- 테스트 코드는 과거 mock 응답인 status='ok' / confidence=0.99를 기대
- 이 차이로 인해 어썰션 실패 (제품 기능 오류 아님)

**참고:**
- 실제 마이크 수동 테스트에서 전체 음성 Flow 동작을 확인했음
- STT 인식 정확도는 백엔드 provider/model과 녹음 환경의 영향을 받음
- 테스트 fixture 업데이트 필요 (별도 작업)

---

## Frontend 주요 구현 포인트

- **음성 녹음 Flow:** MediaRecorder + Web Audio API 무음 감지, 5초/60초 타이밍 제어
- **음성 데이터 전송:** WebM/Opus 녹음 → Base64 인코딩 → 백엔드 전송
- **자격증 후보 매칭:** 백엔드 STT 기반 + 프론트 파싱 + 상태 정합성 (답변 수정 시 후보 갱신)
- **Session 관리:** 타임아웃/만료/오류 시 상태 초기화 후 재생성
- **API 타임아웃:** 세션 생성/음성 답변/직무 추천 요청은 120초, 일반 GET 및 자격증 조회 요청은 30초
- **상태 정합성:** G 답변 수정 시 이전 자격증 선택 상태 검증 (새 후보에 없으면 초기화)
- **레이아웃:** 800x1280 viewport 기준, Tailwind CSS Responsive design
- **E2E 테스트:** Render API 실제 연동 + Layout regression 검증
- **오류 복구:** SESSION_NOT_FOUND/SESSION_EXPIRED 시 상태 초기화 → 새 세션 재생성 → 첫 질문 이동

---

## 프로젝트 구조

```
src/
├── components/
│   └── common/
│       └── LoadingScreen.tsx       # 로딩 화면
├── pages/
│   ├── StartPage.tsx               # 시작 화면
│   ├── TutorialPage.tsx            # 튜토리얼 (1/3 ~ 3/3)
│   ├── VoiceQuestionPage.tsx       # 음성 질문 (C~G)
│   ├── VoiceCertificationSelectionPage.tsx  # 자격증 선택
│   ├── AnswerReviewPage.tsx        # 답변 확인/수정
│   ├── JobRecommendationPage.tsx   # 직무 추천/선택
│   └── ResumeGenerationPage.tsx    # 구직신청서
├── services/
│   ├── apiBase.ts                  # API 기본 설정, getJson/postJson
│   ├── sessionApi.ts               # POST /api/sessions
│   ├── voiceApi.ts                 # POST /api/sessions/{sessionId}/voice-answers
│   ├── recommendationApi.ts        # POST /api/sessions/{sessionId}/voice-recommendations
│   └── certificationApi.ts         # GET /api/certifications (구현 / 미사용)
├── types/
│   ├── flow.ts                     # Flow 타입 (VoiceQuestion, CertificationCandidate 등)
│   └── api.ts                      # API 응답 타입 (MatchedCertification, VoiceAnswerApiResponse 등)
├── data/
│   └── voiceQuestions.ts           # 질문 C~G 목록 및 예시
├── utils/
│   └── audio.ts                    # Blob → Base64 변환
├── App.tsx                         # 메인 애플리케이션 (상태 관리, Flow 제어)
└── main.tsx                        # 엔트리 포인트

tests/
└── e2e/
    ├── voice-flow.spec.ts          # Tutorial / 세션 / 음성 Flow 테스트
    └── layout-800x1280.spec.ts     # 800x1280 Layout regression 테스트

.github/workflows/
└── deploy.yml                      # GitHub Pages 배포 (main branch)

playwright.config.ts                # Playwright 설정
package.json                        # 의존성 및 scripts
.env.example                        # 환경 변수 예시 (API_BASE_URL)
```

---

## 배포

### GitHub Pages

**트리거:** `main` branch push
**과정:**
1. GitHub Actions 워크플로우 실행
2. Node.js 22 환경에서 의존성 설치 (`npm ci`)
3. Vite Production 빌드 (`npm run build`)
4. GitHub Pages에 `dist/` 배포

**환경 변수:**
- 빌드 시: Actions Variable `VITE_API_BASE_URL` 사용
- 백엔드 주소: `https://job-db-api.onrender.com`

**배포 사항:**
- 프론트엔드: GitHub Pages (정적 호스팅)
- 백엔드: Render (Python FastAPI)

---

## 현재 제약사항

### STT 정확도
- STT 인식 정확도는 백엔드 STT provider/model 및 녹음 환경에 영향을 받음
- 자격증 후보는 STT 텍스트를 기반으로 하므로 STT 오인식 시 후보 정확도 저하 가능
- 프론트 문제가 아니라 STT 모델 한계 (사용자는 다시 답변으로 대응 가능)

### 자격증 매칭
- 정식 자격증명이 STT 결과에 포함되어야 매칭 가능
- 예: "지게차운전기능사" 매칭 O, "지게차 자격증" 축약 시 매칭 X 가능
- 백엔드 카탈로그에 없는 자격증은 매칭 안 됨 (정상 상태)
- 자격증 DB의 일부 항목이 아직 검수 중이므로 현재 추천 점수에는 미반영
- 검수 완료 후 자격증을 직무 추천에 반영할 예정

### 미구현 기능
- 선택한 자격증을 백엔드에 저장하는 API (설계 단계)
- 전체 자격증 검색/그룹 필터 UI (미설계)

### E2E 테스트 제약
- Fake microphone fixture STT 응답이 변경되어 1개 Flow 테스트 실패
- 테스트 fixture 업데이트 필요 (제품 기능 오류 아님)

---

## 개발 환경 요구사항

- **Node.js:** 22 권장 (CI는 Node.js 22 사용)
- **npm:** Node.js 22와 함께 제공되는 버전 권장
- **브라우저:** Chrome/Edge 등 Chromium 기반 브라우저 권장, MediaRecorder API 및 audio/webm;codecs=opus 지원 필요
- **마이크:** 오디오 입력 장치 필수

---

## 참고

- [GitHub Repository](https://github.com/ymook38897-tech/skillmatchboard)
- 백엔드 API: `https://job-db-api.onrender.com`
- 개발 API Base URL 설정: `.env.local` 파일
