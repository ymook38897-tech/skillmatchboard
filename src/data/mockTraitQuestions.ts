import type { TraitQuestion } from '../types/flow'

// 문항 수 정책이 아니라 P4 데이터 주입 구조를 검증하기 위한 대표 Mock입니다.
// PRD의 정상 20문항/대체 10문항 충돌이 확정되면 데이터 소스만 교체합니다.
export const MOCK_TRAIT_QUESTIONS: TraitQuestion[] = [
  {
    id: 'mock-q1',
    statement: '사람들과 이야기하며 일하는 편이 좋아요',
    topic: 'preference',
    signalTag: 'customer_contact',
  },
  {
    id: 'mock-q2',
    statement: '해본 일의 순서를 설명할 수 있어요',
    topic: 'experience',
    signalTag: 'work_sequence',
  },
  {
    id: 'mock-q3',
    statement: '낮 시간에 일하는 것이 편해요',
    topic: 'condition',
    signalTag: 'day_shift',
  },
  {
    id: 'mock-q4',
    statement: '혼자 맡은 일을 끝내는 편이에요',
    topic: 'preference',
    signalTag: 'independent_work',
  },
  {
    id: 'mock-q5',
    statement: '새로운 도구를 배워 쓸 수 있어요',
    topic: 'experience',
    signalTag: 'tool_learning',
  },
]
