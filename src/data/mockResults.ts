import { QuestionAnswer, Result } from '../types'

export const MOCK_RESULTS: Result[] = [
  {
    id: 'result1',
    jobTitle: '전산 사무원',
    compatibility: 92,
    description: '컴퓨터를 사용하여 회사의 주요 자료를 정리하고 관리하는 업무',
    reason: '컴퓨터와 기기 사용에 자신감이 있고, 문서 작성과 정리를 선호하는 답변이 반영되었습니다.',
    connectedAnswers: [
      '질문 1: 혼자 집중해서 처리하는 일',
      '질문 3: 문서 작성과 정리',
      '질문 4: 조용한 사무실',
    ],
    mainDuties: [
      '회사 자료의 입력, 정리, 보관',
      '데이터 입력 및 관리',
      '보고서 작성 지원',
      '각종 문서 파일 관리',
    ],
    requiredSkills: [
      'MS Office 활용 능력',
      '꼼꼼함과 집중력',
      '데이터 관리 능력',
      '기본적인 컴퓨터 활용 능력',
    ],
  },
  {
    id: 'result2',
    jobTitle: '고객지원 담당자',
    compatibility: 85,
    description: '고객의 문의사항에 답변하고 불만을 처리하는 업무',
    reason: '사람들과 대화하고 사람을 돕는 보람을 중시하는 답변이 반영되었습니다.',
    connectedAnswers: [
      '질문 1: 사람들과 자주 대화하는 일',
      '질문 2: 사람을 돕는 보람',
      '질문 3: 사람 응대와 설명',
    ],
    mainDuties: [
      '고객 문의 접수 및 상담',
      '고객 불만 처리',
      '제품 관련 정보 제공',
      '고객 만족도 관리',
    ],
    requiredSkills: [
      '의사소통 능력',
      '공감 능력',
      '인내심',
      '문제 해결 능력',
    ],
  },
  {
    id: 'result3',
    jobTitle: '품질관리 보조원',
    compatibility: 78,
    description: '제품의 품질을 검사하고 기준에 맞는지 확인하는 업무',
    reason: '꼼꼼한 성격과 정해진 절차에 따라 일하는 것을 선호하는 답변이 반영되었습니다.',
    connectedAnswers: [
      '질문 1: 정해진 절차에 따라 하는 일',
      '질문 3: 숫자와 자료 분석',
      '질문 5: 설명을 듣고 따라 하기',
    ],
    mainDuties: [
      '제품 품질 검사',
      '부품 상태 확인',
      '검사 기록 작성',
      '불량품 분류 및 보고',
    ],
    requiredSkills: [
      '꼼꼼함과 정확성',
      '기계 사용 능력',
      '집중력',
      '기본 분석 능력',
    ],
  },
]

export function generateResults(
  jobCategories: string[],
  answers: QuestionAnswer[],
): Result[] {
  // 기본 결과를 섞고 일부 카스터마이징
  const results = [...MOCK_RESULTS]

  // IT 또는 경영·사무 카테고리 선택 시 전산 사무원을 첫 번째로
  if (jobCategories.includes('it') || jobCategories.includes('management')) {
    results.sort((a, b) => {
      if (a.jobTitle === '전산 사무원') return -1
      if (b.jobTitle === '전산 사무원') return 1
      return 0
    })
  }

  return results
}
