import { Question } from '../types'

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: '어떤 방식으로 일할 때 가장 편한가요?',
    options: [
      { id: 'opt1_1', text: '사람들과 자주 대화하는 일' },
      { id: 'opt1_2', text: '혼자 집중해서 처리하는 일' },
      { id: 'opt1_3', text: '팀원과 역할을 나누는 일' },
      { id: 'opt1_4', text: '정해진 절차에 따라 하는 일' },
      { id: 'opt1_5', text: '새로운 방법을 생각하는 일' },
      { id: 'opt1_6', text: '현장에서 직접 움직이는 일' },
    ],
  },
  {
    id: 2,
    question: '업무를 선택할 때 가장 중요하게 생각하는 것은 무엇인가요?',
    options: [
      { id: 'opt2_1', text: '안정적인 근무' },
      { id: 'opt2_2', text: '높은 수입' },
      { id: 'opt2_3', text: '일과 삶의 균형' },
      { id: 'opt2_4', text: '성장 가능성' },
      { id: 'opt2_5', text: '사람을 돕는 보람' },
      { id: 'opt2_6', text: '자유로운 업무 방식' },
    ],
  },
  {
    id: 3,
    question: '어떤 종류의 업무에 자신이 있나요?',
    options: [
      { id: 'opt3_1', text: '문서 작성과 정리' },
      { id: 'opt3_2', text: '사람 응대와 설명' },
      { id: 'opt3_3', text: '컴퓨터와 기기 사용' },
      { id: 'opt3_4', text: '물건 제작과 수리' },
      { id: 'opt3_5', text: '아이디어와 디자인' },
      { id: 'opt3_6', text: '숫자와 자료 분석' },
    ],
  },
  {
    id: 4,
    question: '어떤 업무 환경을 더 선호하나요?',
    options: [
      { id: 'opt4_1', text: '조용한 사무실' },
      { id: 'opt4_2', text: '사람을 많이 만나는 공간' },
      { id: 'opt4_3', text: '공장이나 작업 현장' },
      { id: 'opt4_4', text: '야외 근무 환경' },
      { id: 'opt4_5', text: '재택 또는 원격 근무' },
      { id: 'opt4_6', text: '여러 장소를 이동하는 환경' },
    ],
  },
  {
    id: 5,
    question: '새로운 업무를 배울 때 어떤 방식이 편한가요?',
    options: [
      { id: 'opt5_1', text: '설명을 듣고 따라 하기' },
      { id: 'opt5_2', text: '직접 해보면서 배우기' },
      { id: 'opt5_3', text: '매뉴얼을 읽으며 배우기' },
      { id: 'opt5_4', text: '영상을 보며 배우기' },
      { id: 'opt5_5', text: '다른 사람에게 질문하기' },
      { id: 'opt5_6', text: '혼자 시행착오를 겪으며 배우기' },
    ],
  },
]
