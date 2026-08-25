import type {
  VoiceQuestionKey,
  VoiceRecommendationApiJob,
  VoiceRecommendationApiResponse,
} from '../types/api'
import type { VoiceJob } from '../types/flow'
import { ApiRequestError, isRecord, postJson } from './apiBase'

function isQuestionKey(value: unknown): value is VoiceQuestionKey {
  return value === 'C' || value === 'D' || value === 'E' || value === 'F' || value === 'G'
}

function parseJob(value: unknown, index: number): VoiceRecommendationApiJob {
  if (!isRecord(value)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      `추천 jobs[${index}]가 객체가 아닙니다.`,
    )
  }

  const {
    job_code,
    job_name,
    job_name_easy,
    one_liner,
    reason,
    matched_keywords,
  } = value

  if (
    typeof job_code !== 'string' ||
    !job_code.trim() ||
    typeof job_name !== 'string' ||
    !job_name.trim() ||
    typeof job_name_easy !== 'string' ||
    typeof one_liner !== 'string' ||
    typeof reason !== 'string' ||
    !Array.isArray(matched_keywords)
  ) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      `추천 jobs[${index}] 형식이 올바르지 않습니다.`,
      { details: value },
    )
  }

  return {
    job_code,
    job_name,
    job_name_easy,
    one_liner,
    reason,
    matched_keywords: matched_keywords.filter(
      (keyword): keyword is string => typeof keyword === 'string',
    ),
  }
}

function parseRecommendationResponse(
  payload: unknown,
): VoiceRecommendationApiResponse {
  if (!isRecord(payload)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '추천 응답이 객체가 아닙니다.',
    )
  }

  const { session_id, based_on_questions, generated_at, jobs } = payload
  if (
    typeof session_id !== 'string' ||
    !Array.isArray(based_on_questions) ||
    !based_on_questions.every(isQuestionKey) ||
    typeof generated_at !== 'string' ||
    !Array.isArray(jobs)
  ) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '추천 응답 형식이 올바르지 않습니다.',
      { details: payload },
    )
  }

  return {
    session_id,
    based_on_questions,
    generated_at,
    jobs: jobs.slice(0, 5).map(parseJob),
  }
}

function toVoiceJob(job: VoiceRecommendationApiJob): VoiceJob {
  return {
    id: job.job_code,
    name: job.job_name_easy.trim() || job.job_name,
    jobCode: job.job_code,
    formalName: job.job_name,
    oneLiner: job.one_liner,
    reason: job.reason,
    matchedKeywords: [...job.matched_keywords],
  }
}

export async function fetchVoiceRecommendations(
  sessionId: string,
  signal?: AbortSignal,
): Promise<VoiceJob[]> {
  const payload = await postJson(
    `/api/sessions/${encodeURIComponent(sessionId)}/voice-recommendations`,
    {},
    signal,
    90_000,
  )
  const response = parseRecommendationResponse(payload)

  if (response.session_id !== sessionId) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '추천 응답의 session_id가 요청과 다릅니다.',
      { details: payload },
    )
  }

  return response.jobs.map(toVoiceJob)
}
