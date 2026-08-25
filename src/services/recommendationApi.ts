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

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

export function parseRecommendationJob(
  value: unknown,
  index: number,
): VoiceRecommendationApiJob {
  if (!isRecord(value)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      `추천 jobs[${index}]가 객체가 아닙니다.`,
    )
  }

  const {
    id,
    name,
    easyName,
    description,
    categoryId,
    categoryName,
    subCategoryName,
    detailCategoryName,
    requiresCert,
    certNote,
    isRecommendable,
    reason,
    matchedKeywords,
  } = value

  if (
    !isInteger(id) ||
    !isNonEmptyString(name) ||
    !isNullableString(easyName) ||
    !isNullableString(description) ||
    !isInteger(categoryId) ||
    !isNonEmptyString(categoryName) ||
    !isNullableString(subCategoryName) ||
    !isNullableString(detailCategoryName) ||
    typeof requiresCert !== 'boolean' ||
    !isNullableString(certNote) ||
    typeof isRecommendable !== 'boolean' ||
    typeof reason !== 'string' ||
    !Array.isArray(matchedKeywords)
  ) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      `추천 jobs[${index}] 형식이 올바르지 않습니다.`,
      { details: value },
    )
  }

  return {
    id,
    name,
    easyName,
    description,
    categoryId,
    categoryName,
    subCategoryName,
    detailCategoryName,
    requiresCert,
    certNote,
    isRecommendable,
    reason,
    matchedKeywords: matchedKeywords.filter(
      (keyword): keyword is string => typeof keyword === 'string',
    ),
  }
}

export function parseRecommendationResponse(
  payload: unknown,
): VoiceRecommendationApiResponse {
  if (!isRecord(payload)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '추천 응답이 객체가 아닙니다.',
    )
  }

  const { sessionId, basedOnQuestions, generatedAt, jobs } = payload
  if (
    typeof sessionId !== 'string' ||
    !sessionId.trim() ||
    !Array.isArray(basedOnQuestions) ||
    !basedOnQuestions.every(isQuestionKey) ||
    typeof generatedAt !== 'string' ||
    !Array.isArray(jobs)
  ) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '추천 응답 형식이 올바르지 않습니다.',
      { details: payload },
    )
  }

  return {
    sessionId,
    basedOnQuestions,
    generatedAt,
    jobs: jobs.slice(0, 5).map(parseRecommendationJob),
  }
}

export function toVoiceJob(job: VoiceRecommendationApiJob): VoiceJob {
  return {
    id: String(job.id),
    name: job.easyName?.trim() || job.name,
    jobCode: String(job.id),
    formalName: job.name,
    oneLiner: job.description ?? '',
    reason: job.reason,
    matchedKeywords: [...job.matchedKeywords],
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

  if (response.sessionId !== sessionId) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '추천 응답의 sessionId가 요청과 다릅니다.',
      { details: payload },
    )
  }

  return response.jobs.map(toVoiceJob)
}
