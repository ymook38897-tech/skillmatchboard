import type { Result } from '../types'
import type { NormalizedJob } from '../types/api'

const TEMPORARY_RESULT_DEFAULTS = {
  compatibility: 0,
  reason: '직무 DB API 연결 확인을 위해 표시된 직무입니다.',
} as const

// TODO: 백엔드 추천 API 또는 최종 매칭 알고리즘으로 교체한다.
export function selectTemporaryJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  return jobs.slice(0, 3)
}

export function mapNormalizedJobToResult(job: NormalizedJob): Result {
  return {
    id: `api-job-${job.id}`,
    jobTitle: job.displayName,
    compatibility: TEMPORARY_RESULT_DEFAULTS.compatibility,
    description: job.description,
    reason: TEMPORARY_RESULT_DEFAULTS.reason,
    connectedAnswers: [],
    mainDuties: [],
    requiredSkills: [],
  }
}
