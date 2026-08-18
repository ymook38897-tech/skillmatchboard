import type { AgeBandId } from '../types/flow'

export interface SelectionOption<TId extends string = string> {
  id: TId
  label: string
}

export type ProfileCategoryIcon =
  | 'box'
  | 'eye'
  | 'conversation'
  | 'clock'
  | 'outdoors'
  | 'vehicle'
  | 'meal'
  | 'care'
  | 'computer'

export interface ProfileOptionGroup {
  id: string
  label: string
  icon: ProfileCategoryIcon
  options: SelectionOption[]
}

export const AGE_BAND_OPTIONS: SelectionOption<AgeBandId>[] = [
  { id: 'under-50', label: '~49' },
  { id: '50-54', label: '50–54' },
  { id: '55-59', label: '55–59' },
  { id: '60-64', label: '60–64' },
  { id: '65-plus', label: '65+' },
  { id: 'prefer-not-to-answer', label: '답하지 않을래요' },
]

export const BARRIER_MAIN_OPTIONS = [
  { id: 'stand-long', label: '오래 서 있기' },
  { id: 'lift-heavy', label: '무거운 물건 들기' },
  { id: 'read-small-text', label: '작은 글씨 보기' },
  { id: 'hear-speech', label: '말소리 듣기' },
  { id: 'fine-hand-use', label: '손 정교하게 쓰기' },
  { id: 'understand-complex-explanation', label: '복잡한 설명 이해' },
] as const satisfies ReadonlyArray<SelectionOption>

export interface BarrierDetailGroup {
  barrierId: string
  title: string
  options: readonly SelectionOption[]
}

export type BarrierAccordionIcon =
  | 'body'
  | 'senses'
  | 'hands'
  | 'instructions'

export interface BarrierAccordionGroup {
  id: string
  label: string
  summary: string
  icon: BarrierAccordionIcon
  options: readonly SelectionOption[]
}

// 최신 P2-2 Figma에서 확정된 그룹과 몸을 쓰는 일의 문구를 우선합니다.
// 나머지 세부 항목은 기존 프로젝트에 이미 정의된 값만 연결합니다.
export const BARRIER_ACCORDION_GROUPS = [
  {
    id: 'physical-work',
    label: '몸을 쓰는 일',
    summary: '오래 서기 · 걷기 · 무거운 물건 등',
    icon: 'body',
    options: [
      { id: 'stand-long', label: '오래 서 있는 일' },
      { id: 'walk-long', label: '오래 걷는 일' },
      { id: 'stairs-often', label: '계단을 자주 오르내리는 일' },
      { id: 'lift-heavy', label: '무거운 물건을 드는 일' },
    ],
  },
  {
    id: 'seeing-hearing-work',
    label: '눈이나 귀를 많이 쓰는 일',
    summary: '작은 글씨 · 작은 소리 등',
    icon: 'senses',
    options: [
      { id: 'read-small-text', label: '작은 글씨 보는 일' },
      { id: 'hear-speech', label: '말소리 듣기' },
    ],
  },
  {
    id: 'fine-hand-work',
    label: '손을 정교하게 쓰는 일',
    summary: '작은 물건 · 세밀한 손작업 등',
    icon: 'hands',
    options: [{ id: 'fine-hand-use', label: '손을 정교하게 쓰기' }],
  },
  {
    id: 'multi-step-work',
    label: '복잡한 설명이나 여러 단계의 일',
    summary: '긴 설명 · 여러 단계의 지시 등',
    icon: 'instructions',
    options: [
      {
        id: 'understand-complex-explanation',
        label: '복잡한 설명 이해',
      },
    ],
  },
] as const satisfies readonly BarrierAccordionGroup[]

// 상세 상황은 최신 Figma에서 문구가 확인된 항목만 제공합니다.
export const BARRIER_DETAIL_GROUPS = [
  {
    barrierId: 'stand-long',
    title: '어떤 상황이 특히 어려우신가요?',
    options: [
      { id: 'stand-30-minutes', label: '30분 이상 서 있기' },
      { id: 'stairs-up-down', label: '계단 오르내리기' },
      { id: 'walk-long', label: '오래 걷기' },
    ],
  },
] as const satisfies readonly BarrierDetailGroup[]

// PRD V6에서 실제 카테고리 대응표는 기획 미결 상태입니다. 현재 목록은
// 기존 P3 Mock을 보존하면서 바텀시트 동작을 검증할 수 있도록 생활언어로
// 묶은 대표 데이터이며, 확정된 대응표가 나오면 이 배열만 교체합니다.
export const BARRIER_OPTION_GROUPS: ProfileOptionGroup[] = [
  {
    id: 'physical-work',
    label: '몸 쓰는 일',
    icon: 'box',
    options: [
      { id: 'lift-heavy', label: '무거운 것 드는 일' },
      { id: 'stand-long', label: '오래 서 있는 일' },
      { id: 'stairs-often', label: '계단을 자주 오르는 일' },
      { id: 'bend-often', label: '허리를 자주 굽히는 일' },
    ],
  },
  {
    id: 'seeing-work',
    label: '눈으로 보는 일',
    icon: 'eye',
    options: [
      { id: 'read-small-text', label: '작은 글씨 보는 일' },
      { id: 'tell-similar-colors', label: '비슷한 색을 구별하는 일' },
    ],
  },
  {
    id: 'conversation-work',
    label: '듣고 말하는 일',
    icon: 'conversation',
    options: [
      { id: 'talk-long', label: '여러 사람과 오래 대화하는 일' },
      { id: 'hear-in-noise', label: '시끄러운 곳에서 듣는 일' },
    ],
  },
  {
    id: 'work-time',
    label: '일하는 시간',
    icon: 'clock',
    options: [
      { id: 'night-shift', label: '밤에 일하는 것' },
      { id: 'changing-hours', label: '시간이 자주 바뀌는 일' },
    ],
  },
  {
    id: 'work-place',
    label: '일하는 장소',
    icon: 'outdoors',
    options: [
      { id: 'outdoor-long', label: '밖에서 오래 일하는 것' },
      { id: 'hot-or-cold', label: '덥거나 추운 곳에서 일하는 것' },
    ],
  },
]

// 자격증 생활언어 그룹과 전체 대응표도 PRD에서 미결입니다. 기존 네 항목의
// ID와 명칭은 유지하고, 바텀시트·최대 선택 동작 검증에 필요한 대표 종목만
// 정식 자격증 명칭으로 보강했습니다.
export const CERTIFICATION_OPTION_GROUPS: ProfileOptionGroup[] = [
  {
    id: 'driving-equipment',
    label: '운전·장비',
    icon: 'vehicle',
    options: [
      { id: 'forklift', label: '지게차운전기능사' },
      { id: 'excavator', label: '굴착기운전기능사' },
    ],
  },
  {
    id: 'cooking-food',
    label: '조리·음식',
    icon: 'meal',
    options: [
      { id: 'cook-korean', label: '한식조리기능사' },
      { id: 'cook-western', label: '양식조리기능사' },
      { id: 'confectionery', label: '제과기능사' },
      { id: 'bread-making', label: '제빵기능사' },
    ],
  },
  {
    id: 'care-welfare',
    label: '돌봄·복지',
    icon: 'care',
    options: [
      { id: 'care-worker', label: '요양보호사' },
      { id: 'social-worker-2', label: '사회복지사 2급' },
    ],
  },
  {
    id: 'office-computer',
    label: '사무·컴퓨터',
    icon: 'computer',
    options: [
      { id: 'computer-specialist-1', label: '컴퓨터활용능력 1급' },
      { id: 'computer-specialist-2', label: '컴퓨터활용능력 2급' },
      { id: 'word-processor', label: '워드프로세서' },
    ],
  },
]

export interface CertificationCategory {
  id: string
  label: string
  options: readonly SelectionOption[]
}

// 카테고리 명칭과 운전·운송 목록은 최신 Figma에서 확인한 값입니다.
// 그 밖의 목록은 기존 Mock에 이미 있던 자격증만 옮겼으며, 확인되지 않은
// 자격증은 빈 배열로 남겨 후속 디자인/데이터를 임의로 확정하지 않습니다.
export const CERTIFICATION_CATEGORIES = [
  {
    id: 'driving-transport',
    label: '운전·운송',
    options: [
      { id: 'driver-license-class-2', label: '2종 보통 운전면허' },
      { id: 'driver-license-class-1', label: '1종 보통 운전면허' },
      { id: 'freight-transport-license', label: '화물운송종사 자격' },
      { id: 'forklift', label: '지게차운전기능사' },
      { id: 'bus-driver-license', label: '버스운전자격' },
    ],
  },
  {
    id: 'cooking-food',
    label: '조리·음식',
    options: [
      { id: 'cook-korean', label: '한식조리기능사' },
      { id: 'cook-western', label: '양식조리기능사' },
      { id: 'confectionery', label: '제과기능사' },
      { id: 'bread-making', label: '제빵기능사' },
    ],
  },
  { id: 'facility-safety', label: '시설·안전', options: [] },
  {
    id: 'office-accounting',
    label: '사무·회계',
    options: [
      { id: 'computer-specialist-1', label: '컴퓨터활용능력 1급' },
      { id: 'computer-specialist-2', label: '컴퓨터활용능력 2급' },
      { id: 'word-processor', label: '워드프로세서' },
    ],
  },
  {
    id: 'care-welfare',
    label: '돌봄·복지',
    options: [
      { id: 'care-worker', label: '요양보호사' },
      { id: 'social-worker-2', label: '사회복지사 2급' },
    ],
  },
  {
    id: 'technical-skills',
    label: '기술·기능',
    options: [{ id: 'excavator', label: '굴착기운전기능사' }],
  },
  { id: 'beauty-service', label: '미용·서비스', options: [] },
  { id: 'other', label: '기타', options: [] },
] as const satisfies readonly CertificationCategory[]

export type CertificationCategoryId =
  (typeof CERTIFICATION_CATEGORIES)[number]['id']

export const BARRIER_OPTIONS = BARRIER_OPTION_GROUPS.flatMap(
  (group) => group.options,
)

export const CERTIFICATION_OPTIONS = CERTIFICATION_CATEGORIES.flatMap(
  (group) => [...group.options],
)

export function getBarrierLabel(id: string): string {
  return (
    BARRIER_ACCORDION_GROUPS.flatMap<SelectionOption>((group) => [
      ...group.options,
    ]).find((option) => option.id === id)?.label ??
    BARRIER_MAIN_OPTIONS.find((option) => option.id === id)?.label ??
    BARRIER_OPTIONS.find((option) => option.id === id)?.label ??
    id
  )
}

export function getCertificationLabel(id: string): string {
  return CERTIFICATION_OPTIONS.find((option) => option.id === id)?.label ?? id
}
