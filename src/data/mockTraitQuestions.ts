import type { TraitQuestion } from '../types/flow'

// 최종 P3 와이어프레임의 10문항 흐름을 검증하는 프론트 Mock입니다.
// 이후 질문 공급원이 연결되어도 QuestionPage의 UI 계약은 그대로 유지합니다.
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
    statement: '일하는 동안 새롭게 배우는 일이 있으면 좋다.',
    topic: 'preference',
    signalTag: 'learning_opportunity',
  },
  {
    id: 'mock-q4',
    statement: '정해진 순서대로\n차근차근 일하는 것이 편하다.',
    topic: 'preference',
    signalTag: 'structured_work',
  },
  {
    id: 'mock-q5',
    statement:
      '사람들과 자주 대화하는 일보다\n혼자 집중하는 일이 편하다.',
    topic: 'preference',
    signalTag: 'focused_work',
  },
  {
    id: 'mock-q6',
    statement: '낮 시간에 일하는 것이 편해요',
    topic: 'condition',
    signalTag: 'day_shift',
  },
  {
    id: 'mock-q7',
    statement: '새로운 도구를 배워 쓸 수 있어요',
    topic: 'experience',
    signalTag: 'tool_learning',
  },
  {
    id: 'mock-q8',
    statement: '사람을 도와주는 일이 보람 있게 느껴져요',
    topic: 'preference',
    signalTag: 'helping_others',
  },
  {
    id: 'mock-q9',
    statement: '움직이며 일하는 것이 오래 앉아 있는 것보다 좋아요',
    topic: 'preference',
    signalTag: 'active_work',
  },
  {
    id: 'mock-q10',
    statement: '여러 가지 일을 번갈아 하는 것이 괜찮아요',
    topic: 'preference',
    signalTag: 'task_variety',
  },
]
