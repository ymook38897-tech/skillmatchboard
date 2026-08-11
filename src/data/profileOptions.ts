import type { AgeBandId } from '../types/flow'

export interface SelectionOption<TId extends string = string> {
  id: TId
  label: string
}

export const AGE_BAND_OPTIONS: SelectionOption<AgeBandId>[] = [
  { id: 'under-50', label: '49세 이하' },
  { id: '50-54', label: '50~54세' },
  { id: '55-59', label: '55~59세' },
  { id: '60-64', label: '60~64세' },
  { id: '65-plus', label: '65세 이상' },
  { id: 'prefer-not-to-answer', label: '답하지 않을래요' },
]

// V6 화면 흐름을 확인하기 위한 소규모 Mock입니다. 실제 목록은 검수된
// 어려운 일 데이터와 생활언어 카테고리 시트로 교체합니다.
export const MOCK_BARRIER_OPTIONS: SelectionOption[] = [
  { id: 'lift-heavy', label: '무거운 것 드는 일' },
  { id: 'stand-long', label: '오래 서 있는 일' },
  { id: 'night-shift', label: '밤에 일하는 것' },
  { id: 'outdoor-long', label: '밖에서 오래 일하는 것' },
]

// 정식 자격증 코드 데이터가 연결되기 전 화면 구조 확인용 Mock입니다.
export const MOCK_CERTIFICATION_OPTIONS: SelectionOption[] = [
  { id: 'computer-specialist-2', label: '컴퓨터활용능력 2급' },
  { id: 'cook-korean', label: '한식조리기능사' },
  { id: 'forklift', label: '지게차운전기능사' },
  { id: 'care-worker', label: '요양보호사' },
]

export function getCertificationLabel(id: string): string {
  return (
    MOCK_CERTIFICATION_OPTIONS.find((option) => option.id === id)?.label ?? id
  )
}
