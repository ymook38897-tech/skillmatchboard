import type { VoiceQuestion } from '../types/flow'

export const VOICE_QUESTIONS: VoiceQuestion[] = [
  {
    id: 'difficulty',
    title: '피하고 싶은 일이 있나요?',
    order: 1,
    examples: [
      '무거운 물건을 드는 일은 피하고 싶어요.',
      '오래 서 있는 일은 힘들어요.',
      '컴퓨터를 오래 쓰는 일은 어려워요.',
    ],
  },
  {
    id: 'experience',
    title: '기억나는 일이 있나요?',
    order: 2,
    examples: [
      '식당에서 손님을 응대한 적이 있어요.',
      '건물 청소와 정리를 해봤어요.',
      '가족을 돌본 경험이 있어요.',
    ],
  },
  {
    id: 'interest',
    title: '해보고 싶은 일이 있나요?',
    order: 3,
    examples: [
      '사람을 돕는 일을 해보고 싶어요.',
      '손으로 물건을 만드는 일이 좋아요.',
      '정리하고 관리하는 일을 해보고 싶어요.',
    ],
  },
  {
    id: 'strength',
    title: '평소에 자주 하는 일이 있나요?',
    order: 4,
    examples: [
      '사람들과 이야기하는 일을 자주 해요.',
      '집에서 요리와 청소를 자주 해요.',
      '물건을 순서대로 정리하는 편이에요.',
    ],
  },
  {
    id: 'certificate',
    title: '자격증이 있으신가요?',
    order: 5,
    examples: [
      '나 운전해 봤어요.',
      '요양보호사 자격증이 있어요.',
      '조리 자격증을 딴 적이 있어요.',
    ],
  },
]

export const MOCK_ANSWERS = {
  difficulty: '무거운 물건을 드는 일과 오래 서 있는 일이 어려워요.',
  experience: '식당 주방 보조와 배달 일을 해봤어요.',
  interest: '사람을 돕는 일을 하고 싶어요.',
  strength: '정리하고 안내하는 일을 잘해요.',
  certificate: '컴퓨터활용능력 2급과 한식조리기능사 자격증이 있어요.',
}

export function getQuestionByOrder(order: number): VoiceQuestion | undefined {
  return VOICE_QUESTIONS.find((q) => q.order === order)
}

export function getQuestionById(id: string): VoiceQuestion | undefined {
  return VOICE_QUESTIONS.find((q) => q.id === id)
}
