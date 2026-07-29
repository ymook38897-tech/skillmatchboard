# Skill Match Board - 구현 완료

## 프로젝트 개요
구직자가 자신의 기본 정보와 희망 직종을 선택하고, 5단계 질문에 답하면 AI가 적합한 직무를 추천하는 서비스

## 기술 스택
- **프레임워크**: React 19 + TypeScript
- **빌드**: Vite
- **스타일**: Tailwind CSS 4
- **상태 관리**: React useState (Context 불필요)

---

## ✅ 구현된 5개 화면

### 1. **시작 화면 (StartPage.tsx)**
- 서비스명: "Skill Match Board"
- 메인 메시지: "막연했던 희망 직무를 구체적으로 찾아보세요."
- 설명 문구와 "직무 찾기 시작" CTA 버튼
- 정보 카드 3개 (소요시간, 추천 직무 수, 보안)
- 진입 버튼 클릭 시 기본정보 입력 화면으로 이동

### 2. **기본정보 입력 화면 (BasicInfoPage.tsx)**
**연령대 선택:**
- 스크롤/휠 방식으로 선택 (마우스 휠, 터치 스크롤, 키보드 방향키 지원)
- 현재 선택된 항목이 중앙에서 강조됨
- 선택지: 10대, 20대, 30대, 40대, 50대, 60대 이상

**성별 선택:**
- 버튼 방식 (선택사항)
- 선택지: 남성, 여성, 선택하지 않음
- 선택된 버튼은 색상 + 체크 표시로 구분

**네비게이션:**
- 이전 버튼: 시작 화면으로
- 다음 버튼: 연령대 선택 필수, 성별은 선택사항

### 3. **희망 직종 대분류 선택 화면 (JobCategoryPage.tsx)**
**대분류 목록 (10개):**
1. 경영·사무
2. 금융·보험
3. 교육·연구
4. 보건·복지
5. 문화·예술·디자인
6. 영업·판매·고객서비스
7. 음식·서비스
8. 건설·시설
9. 생산·제조
10. IT·전기·전자

**기능:**
- 한 번에 4개씩 표시 (2열 격자)
- 페이지 이동: "이전 분야" / "다른 분야 보기" 버튼
- 하나의 대분류만 선택 가능 (다시 누르면 해제)
- 선택 상태는 색상 + 체크 표시로 구분

**"잘 모르겠어요" 버튼:**
- 선택 시 모든 대분류 버튼 비활성화
- 선택한 대분류 모두 해제
- 다시 누르면 해제 가능

### 4. **질문 특화 LLM 화면 (QuestionPage.tsx)**
**5단계 질문 시스템:**
- 진행 상태 표시 (현재 진행/전체, 프로그레스 바)
- 각 단계마다 질문 1개 + 답변 선택지 6개

**질문 목록:**
1. 어떤 방식으로 일할 때 가장 편한가요?
2. 업무를 선택할 때 가장 중요하게 생각하는 것은 무엇인가요?
3. 어떤 종류의 업무에 자신이 있나요?
4. 어떤 업무 환경을 더 선호하나요?
5. 새로운 업무를 배울 때 어떤 방식이 편한가요?

**답변 선택:**
- 한 번에 하나의 답변만 선택 가능
- 다른 답변 선택 시 자동 변경
- 선택된 버튼은 체크 표시로 구분

**"잘 모르겠어요" 버튼:**
- 6개 답변 버튼 아래 별도 배치
- 선택 시 6개 버튼 비활성화
- 기존 선택 해제
- 다시 누르면 선택 해제 가능

**이전 질문 이동 규칙:**
- 이전 질문으로 이동하면 이후 질문의 모든 답변 삭제
- 예: 3단계에서 1단계로 이동 → 2, 3단계 답변 삭제
- 삭제된 답변은 배열에서 실제로 제거됨

**네비게이션:**
- 1단계: "이전 페이지" / "다음 질문"
- 2-4단계: "이전 질문" / "다음 질문"
- 5단계: "이전 질문" / "결과 확인"
- 현재 질문에 답변해야 다음 버튼 활성화

### 5. **결과 화면 (ResultPage.tsx)**
**로딩 화면 (LoadingPage.tsx):**
- "분석 중입니다" 메시지
- 진행률 표시 (0-100%)
- 애니메이션 로딩 인디케이터
- 약 2초 후 결과 화면으로 이동

**결과 표시:**
- 3개의 추천 직무 카드를 세로로 나열
- 각 카드에 포함된 정보:
  - 순위 (1-3, 색상으로 구분)
  - 직무명
  - 적합도 (퍼센트 + 진행 막대)
  - 한 줄 설명

**상세 정보 (펼침/접힘):**
- 추천 이유
- 당신의 답변과의 연결 (답변 기반 설명)
- 주요 업무 (4개 항목)
- 필요한 역량 (스킬 태그)

**결과 커스터마이징:**
- 선택한 대분류에 따라 결과 순서 변경
- Mock 데이터 3개 기본 제공
- 확장 가능한 구조

**"처음부터 다시 하기" 버튼:**
- 모든 입력값 초기화
- 시작 화면으로 이동

---

## 📂 프로젝트 파일 구조

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx           # 재사용 가능한 버튼 컴포넌트
│   │   └── NavigationButtons.tsx # 하단 네비게이션 버튼
├── pages/
│   ├── StartPage.tsx            # 시작 화면
│   ├── BasicInfoPage.tsx        # 기본정보 입력
│   ├── JobCategoryPage.tsx      # 대분류 선택
│   ├── QuestionPage.tsx         # 질문 진행 (5단계)
│   ├── LoadingPage.tsx          # 로딩 화면
│   └── ResultPage.tsx           # 결과 화면
├── data/
│   ├── jobCategories.ts         # 10개 직종 대분류
│   ├── questions.ts             # 5단계 질문 + 선택지
│   └── mockResults.ts           # Mock 결과 데이터 + 생성 함수
├── types/
│   └── index.ts                 # TypeScript 타입 정의
├── App.tsx                      # 메인 앱 (페이지 관리 + 상태)
└── main.tsx                     # 진입점
```

---

## 🔄 상태 관리 구조

### UserFormData (App.tsx의 상태)
```ts
{
  ageGroup: AgeGroup | null,          // 선택한 연령대
  gender: Gender | null,               // 선택한 성별
  jobCategories: string[],             // 선택한 직종 ID 배열 (최대 3개)
  jobCategoryUnknown: boolean,        // "잘 모르겠어요" 상태
  answers: QuestionAnswer[]            // 5단계 답변 배열
}
```

### QuestionAnswer (각 질문의 답변)
```ts
{
  questionId: number,           // 질문 ID (1-5)
  selectedOptionId: string | null, // 선택한 옵션 ID
  isUnknown: boolean            // "잘 모르겠어요" 선택 여부
}
```

### 상태 관리 규칙
- 페이지 이동 시에도 입력값 유지
- "잘 모르겠어요" 선택 시 다른 버튼 비활성화
- 이전 질문 이동 시 이후 답변 배열에서 삭제
- "처음부터 다시 하기" 시 전체 상태 초기화

---

## 🎨 디자인 시스템

### 색상 팔레트
**Primary (Indigo):**
- 500: #6366f1, 600: #4f46e5, 700: #4338ca

**Accent (Purple):**
- 500: #8b5cf6, 600: #7c3aed, 700: #6d28d9

**버튼 스타일:**
- Primary: 그래디언트 배경 + 흰 텍스트 (주요 CTA)
- Secondary: 밝은 배경 + 컬러 텍스트 (부수 액션)
- Outline: 테두리 버튼 (이전/취소)

### 반응형 디자인
- Mobile-first 접근
- 모바일: 1열 구조
- Tablet (640px+): 2열 구조  
- Desktop (1024px+): 3열 구조
- 터치 타겟 최소 44×44px (모바일)

### 애니메이션
- fade-in: 300ms
- slide-up: 400ms
- 스케일 효과: active:scale-95

---

## 🚀 실행 방법

### 개발 서버 시작
```bash
npm run dev
# http://localhost:5173 접속
```

### 프로덕션 빌드
```bash
npm run build
# dist 폴더에 최적화된 번들 생성
```

### 빌드 미리보기
```bash
npm run preview
```

---

## ✨ 핵심 구현 특징

### 1. 휠/터치/키보드 지원 (BasicInfoPage)
- 마우스 휠로 연령대 선택 가능
- 터치 스크롤 지원
- 화살표 키로 이동 가능

### 2. 이전 질문 이동 시 자동 삭제 (QuestionPage)
```tsx
// 현재 질문 이전 단계로 이동할 때 이후 답변 삭제
newAnswers.map(a =>
  a.questionId > QUESTIONS[currentQuestionIndex - 1].id
    ? { ...a, selectedOptionId: null, isUnknown: false }
    : a
)
```

### 3. Mock 데이터 기반 결과 (mockResults.ts)
```tsx
function generateResults(jobCategories, answers) {
  // 선택한 직종 배열에 따라 결과 순서 변경
  // IT 선택 시 전산 사무원 우선
  // 경영·사무 선택 시 전산 사무원 우선
}
```

### 4. 접근성 고려
- 모든 버튼에 명확한 상태 표시 (색상 + 아이콘)
- 충분한 터치 영역 확보
- 의미 있는 라벨과 ARIA 속성

---

## 📝 변경 사항 정리

### 수정된 파일
1. **tsconfig.json** - TypeScript 설정 최적화
2. **tailwind.config.js** - 커스텀 색상/스페이싱 정의
3. **postcss.config.js** - @tailwindcss/postcss 설정
4. **src/index.css** - Tailwind 4 방식으로 업데이트

### 신규 파일 (25개)
- types/index.ts
- data/ 폴더 (3개)
- components/common/ 폴더 (2개)
- pages/ 폴더 (6개)
- App.tsx (완전 재작성)

### 삭제된 파일
- src/App.css (불필요)
- 기존 랜딩 페이지 컴포넌트

---

## 🔧 추가 개발 가능 부분

- 실제 LLM API 연동 (현재: Mock Data)
- 백엔드 데이터베이스 연동
- 사용자 인증/가입 기능
- 결과 공유 기능
- 북마크/저장 기능
- 분석 대시보드
- 다국어 지원
- PWA 설정

---

## ✅ 빌드 상태

```
✓ npm run build 성공
✓ dist 폴더에 최적화 번들 생성
✓ 모든 TypeScript 타입 체크 통과
✓ CSS 빌드 완료
```

**파일 크기:**
- HTML: 0.46 KB
- CSS: 54.55 KB (gzip: 9.69 KB)
- JS: 214.35 KB (gzip: 66.81 KB)

---

## 📌 개발자 참고

- **상태 관리**: React Context 불필요 (App.tsx의 useState만 사용)
- **스타일**: 모두 Tailwind CSS 클래스 기반
- **Mock 데이터**: data 폴더에서 관리 (API 연동 시 교체 용이)
- **컴포넌트 분리**: 각 페이지와 공통 컴포넌트 분리
- **타입 안정성**: TypeScript로 전체 타입 정의
