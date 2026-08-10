import type {
  ApiJobListResponse,
  CompatibleApiJob,
  JobApiSchema,
  LegacyApiJob,
  NewApiJob,
  NormalizedJob,
} from '../types/api'
import { normalizeJob } from '../utils/normalizeJob'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '')
  .trim()
  .replace(/\/+$/, '')
const RECOMMENDABLE_JOBS_PATH = '/api/jobs?recommendableOnly=true'
const LEGACY_JOBS_PATH = '/api/jobs'
const REQUEST_TIMEOUT_MS = 15_000

export type JobsApiErrorCode =
  | 'CONFIGURATION'
  | 'ABORTED'
  | 'TIMEOUT'
  | 'NETWORK_OR_CORS'
  | 'NGROK_TUNNEL'
  | 'HTTP'
  | 'JSON_PARSE'
  | 'INVALID_RESPONSE'
  | 'EMPTY_JOBS'

export class JobsApiError extends Error {
  readonly code: JobsApiErrorCode
  readonly status?: number

  constructor(code: JobsApiErrorCode, message: string, status?: number) {
    super(message)
    this.name = 'JobsApiError'
    this.code = code
    this.status = status
  }
}

type ParsedJobListResponse =
  | (ApiJobListResponse<LegacyApiJob> & { schema: 'legacy' })
  | (ApiJobListResponse<NewApiJob> & { schema: 'new' })

interface JobsResponseBody {
  requestPath: string
  responseText: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasOwn(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key)
}

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value)
}

function parseLegacyApiJob(value: unknown, index: number): LegacyApiJob {
  if (!isRecord(value)) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      `items[${index}]가 객체가 아닙니다.`,
    )
  }

  const {
    id,
    code,
    name,
    categoryId,
    categoryName,
    avgSalaryBand,
    outlook,
    description,
  } = value

  if (
    !isInteger(id) ||
    !isString(code) ||
    !isNonEmptyString(name) ||
    !isInteger(categoryId) ||
    !isNonEmptyString(categoryName) ||
    !isNullableString(avgSalaryBand) ||
    !isNullableString(outlook) ||
    !isNullableString(description)
  ) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      `items[${index}]가 구형 직무 API 스키마와 다릅니다.`,
    )
  }

  return {
    id,
    code,
    name,
    categoryId,
    categoryName,
    avgSalaryBand,
    outlook,
    description,
  }
}

function parseNewApiJob(value: unknown, index: number): NewApiJob {
  if (!isRecord(value)) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      `items[${index}]가 객체가 아닙니다.`,
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
    typeof isRecommendable !== 'boolean'
  ) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      `items[${index}]가 새 직무 API 스키마와 다릅니다.`,
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
  }
}

function parseJobListResponse(value: unknown): ParsedJobListResponse {
  if (!isRecord(value)) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      '직무 응답이 객체가 아닙니다.',
    )
  }

  const { total, items } = value
  if (!isInteger(total) || total < 0 || !Array.isArray(items)) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      '직무 응답이 { total, items } 구조가 아닙니다.',
    )
  }

  if (items.length === 0) {
    throw new JobsApiError('EMPTY_JOBS', '직무 목록이 비어 있습니다.')
  }

  const firstItem = items[0]
  if (!isRecord(firstItem)) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      'items[0]가 객체가 아닙니다.',
    )
  }

  if (hasOwn(firstItem, 'isRecommendable')) {
    return {
      schema: 'new',
      total,
      items: items.map(parseNewApiJob),
    }
  }

  return {
    schema: 'legacy',
    total,
    items: items.map(parseLegacyApiJob),
  }
}

function createRequestHeaders(): Headers {
  const headers = new Headers({ Accept: 'application/json' })

  try {
    const hostname = new URL(API_BASE_URL).hostname.toLowerCase()
    if (/(^|\.)ngrok(?:-free)?\.(?:app|dev|io)$/.test(hostname)) {
      headers.set('ngrok-skip-browser-warning', 'true')
    }
  } catch {
    // 잘못된 기본 URL은 아래 fetch 오류로 분류한다.
  }

  return headers
}

async function requestJobs(
  requestPath: string,
  headers: Headers,
  signal: AbortSignal,
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}${requestPath}`, {
    method: 'GET',
    headers,
    signal,
  })
  const responseText = await response.text()

  if (/ERR_NGROK_\d+/i.test(responseText)) {
    throw new JobsApiError(
      'NGROK_TUNNEL',
      'ngrok 터널 오류 응답을 받았습니다.',
      response.status,
    )
  }

  if (!response.ok) {
    throw new JobsApiError(
      'HTTP',
      `직무 API가 HTTP ${response.status}로 응답했습니다.`,
      response.status,
    )
  }

  return responseText
}

async function requestJobsWithCompatibility(
  headers: Headers,
  signal: AbortSignal,
): Promise<JobsResponseBody> {
  try {
    return {
      requestPath: RECOMMENDABLE_JOBS_PATH,
      responseText: await requestJobs(
        RECOMMENDABLE_JOBS_PATH,
        headers,
        signal,
      ),
    }
  } catch (error: unknown) {
    if (
      error instanceof JobsApiError &&
      error.code === 'HTTP' &&
      (error.status === 400 || error.status === 422)
    ) {
      return {
        requestPath: LEGACY_JOBS_PATH,
        responseText: await requestJobs(LEGACY_JOBS_PATH, headers, signal),
      }
    }

    throw error
  }
}

let didLogJobsSummary = false

function logJobsSummaryOnce(
  requestPath: string,
  schema: JobApiSchema,
  normalizedJobCount: number,
) {
  if (!import.meta.env.DEV || didLogJobsSummary) return

  didLogJobsSummary = true
  console.info('[Jobs API]', {
    requestPath,
    responseSchema: schema,
    normalizedJobCount,
  })
}

export async function fetchJobs(
  signal?: AbortSignal,
): Promise<NormalizedJob[]> {
  if (!API_BASE_URL) {
    throw new JobsApiError(
      'CONFIGURATION',
      'VITE_API_BASE_URL이 설정되지 않았습니다.',
    )
  }

  if (signal?.aborted) {
    throw new JobsApiError('ABORTED', '직무 요청이 취소되었습니다.')
  }

  const requestController = new AbortController()
  let abortReason: 'caller' | 'timeout' | null = null

  const abortRequest = (reason: 'caller' | 'timeout') => {
    if (abortReason !== null) return
    abortReason = reason
    requestController.abort()
  }

  const abortFromCaller = () => abortRequest('caller')
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  const timeoutId = window.setTimeout(() => {
    abortRequest('timeout')
  }, REQUEST_TIMEOUT_MS)

  try {
    const { requestPath, responseText } = await requestJobsWithCompatibility(
      createRequestHeaders(),
      requestController.signal,
    )

    let payload: unknown
    try {
      payload = JSON.parse(responseText) as unknown
    } catch {
      throw new JobsApiError(
        'JSON_PARSE',
        '직무 API 응답을 JSON으로 해석할 수 없습니다.',
      )
    }

    const parsedResponse = parseJobListResponse(payload)
    const compatibleJobs: CompatibleApiJob[] =
      parsedResponse.schema === 'new'
        ? parsedResponse.items.filter(
            (job) => job.isRecommendable !== false,
          )
        : parsedResponse.items
    const normalizedJobs = compatibleJobs.map(normalizeJob)

    logJobsSummaryOnce(
      requestPath,
      parsedResponse.schema,
      normalizedJobs.length,
    )

    if (normalizedJobs.length === 0) {
      throw new JobsApiError('EMPTY_JOBS', '추천 가능한 직무가 없습니다.')
    }

    return normalizedJobs
  } catch (error: unknown) {
    if (error instanceof JobsApiError) {
      throw error
    }

    if (abortReason === 'caller') {
      throw new JobsApiError('ABORTED', '직무 요청이 취소되었습니다.')
    }

    if (abortReason === 'timeout') {
      throw new JobsApiError(
        'TIMEOUT',
        `${REQUEST_TIMEOUT_MS}ms 안에 직무 API 응답을 받지 못했습니다.`,
      )
    }

    throw new JobsApiError(
      'NETWORK_OR_CORS',
      error instanceof Error
        ? `백엔드 접속 또는 CORS 오류: ${error.message}`
        : '백엔드 접속 또는 CORS 오류가 발생했습니다.',
    )
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortFromCaller)
  }
}

const ERROR_LABELS: Record<JobsApiErrorCode, string> = {
  CONFIGURATION: '환경변수 설정 오류',
  ABORTED: '요청 취소',
  TIMEOUT: '백엔드 응답 시간 초과',
  NETWORK_OR_CORS: '백엔드 접속 실패 또는 CORS 오류',
  NGROK_TUNNEL: 'ngrok 터널 종료 또는 경고 응답',
  HTTP: 'HTTP 오류',
  JSON_PARSE: 'JSON 파싱 오류',
  INVALID_RESPONSE: '응답 형식 불일치',
  EMPTY_JOBS: '직무 목록이 비어 있음',
}

export function logJobsApiError(error: unknown) {
  if (error instanceof JobsApiError) {
    console.error(`[Jobs API] ${ERROR_LABELS[error.code]}`, {
      code: error.code,
      status: error.status,
      message: error.message,
    })
    return
  }

  console.error('[Jobs API] 알 수 없는 오류', error)
}
