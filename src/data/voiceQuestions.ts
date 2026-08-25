import type { VoiceQuestion } from '../types/flow'

export const VOICE_QUESTIONS: VoiceQuestion[] = [
  {
    id: 'difficulty',
    title: '하기 어려운 일이 있나요?',
    order: 1,
  },
  {
    id: 'experience',
    title: '경험해 본 일이 무엇인가요?',
    order: 2,
  },
  {
    id: 'interest',
    title: '하고 싶은 일이 있나요?',
    order: 3,
  },
  {
    id: 'strength',
    title: '자신 있는 일이 무엇인가요?',
    order: 4,
  },
  {
    id: 'certificate',
    title: '가지고 있는 자격증이 있나요?',
    order: 5,
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
