import type { ApiJob } from '../types/api'
import type { Result } from '../types'

const TEMPORARY_RESULT_DEFAULTS = {
  compatibility: 0,
  reason: '직무 DB API 연결 확인을 위해 표시된 직무입니다.',
} as const

function getJobDescription(job: ApiJob) {
  const description = job.description?.trim()
  if (description) return description

  return `분야: ${job.categoryName} · 직업 코드: ${job.code}`
}

// TODO: 백엔드 추천 API 또는 최종 매칭 알고리즘으로 교체한다.
export function selectTemporaryJobs(jobs: ApiJob[]): ApiJob[] {
  return jobs.slice(0, 3)
}

export function mapApiJobToResult(job: ApiJob): Result {
  return {
    id: `api-job-${job.id}`,
    jobTitle: job.name,
    compatibility: TEMPORARY_RESULT_DEFAULTS.compatibility,
    description: getJobDescription(job),
    reason: TEMPORARY_RESULT_DEFAULTS.reason,
    connectedAnswers: [],
    mainDuties: [],
    requiredSkills: [],
  }
}
