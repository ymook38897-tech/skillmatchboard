import anyIcon from '../assets/icons/work-preferences/any.svg'
import calendarIcon from '../assets/icons/work-preferences/calendar.svg'
import clockSelectedIcon from '../assets/icons/work-preferences/clock-selected.svg'
import clockIcon from '../assets/icons/work-preferences/clock.svg'
import distanceIcon from '../assets/icons/work-preferences/distance.svg'
import earlyMorningIcon from '../assets/icons/work-preferences/early-morning.svg'
import immediateIcon from '../assets/icons/work-preferences/immediate.svg'
import nightIcon from '../assets/icons/work-preferences/night.svg'
import prepareIcon from '../assets/icons/work-preferences/prepare.svg'
import sunIcon from '../assets/icons/work-preferences/sun.svg'
import wageIcon from '../assets/icons/work-preferences/wage.svg'

export const WORK_PREFERENCE_GROUPS = [
  {
    id: 'work-time',
    question: '언제 일하고 싶으세요?',
    options: [
      { id: 'daytime', label: '주간', icon: sunIcon },
      { id: 'early-morning', label: '이른 아침', icon: earlyMorningIcon },
      { id: 'evening-night', label: '저녁·야간', icon: nightIcon },
      { id: 'any', label: '상관없어요', icon: anyIcon, isAny: true },
    ],
  },
  {
    id: 'commute',
    question: '통근은 어느 정도 괜찮으세요?',
    options: [
      { id: 'within-30', label: '30분 안', icon: clockIcon },
      {
        id: 'within-60',
        label: '60분 안',
        icon: clockIcon,
        selectedIcon: clockSelectedIcon,
      },
      { id: 'within-90', label: '90분 안', icon: clockIcon },
      { id: 'any', label: '상관없어요', icon: anyIcon, isAny: true },
    ],
  },
  {
    id: 'start-time',
    question: '언제부터 시작할 수 있으세요?',
    options: [
      { id: 'now', label: '바로', icon: immediateIcon },
      { id: 'within-month', label: '한 달 안', icon: calendarIcon },
      { id: 'after-preparation', label: '준비 후', icon: prepareIcon },
      { id: 'any', label: '상관없어요', icon: anyIcon, isAny: true },
    ],
  },
  {
    id: 'priority',
    question: '가장 중요한 조건은 무엇인가요?',
    options: [
      { id: 'distance', label: '거리', icon: distanceIcon },
      { id: 'time', label: '시간', icon: clockIcon },
      { id: 'wage', label: '임금', icon: wageIcon },
      { id: 'any', label: '상관없어요', icon: anyIcon, isAny: true },
    ],
  },
] as const

export type WorkPreferenceQuestionId =
  (typeof WORK_PREFERENCE_GROUPS)[number]['id']

export type WorkPreferenceOptionId =
  (typeof WORK_PREFERENCE_GROUPS)[number]['options'][number]['id']

export type WorkPreferenceDraft = Record<
  WorkPreferenceQuestionId,
  WorkPreferenceOptionId | null
>

export function createInitialWorkPreferenceDraft(): WorkPreferenceDraft {
  return {
    'work-time': null,
    commute: null,
    'start-time': null,
    priority: null,
  }
}
