import type { ApiJob, ApiJobListResponse } from '../types/api'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '')
  .trim()
  .replace(/\/+$/, '')
const JOBS_PATH = '/api/jobs'
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

function parseApiJob(value: unknown, index: number): ApiJob {
  if (!isRecord(value)) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      `items[${index}]가 객체가 아닙니다.`,
    )
  }

  if (
    !Number.isInteger(value.id) ||
    !isString(value.code) ||
    !isString(value.name) ||
    !Number.isInteger(value.categoryId) ||
    !isString(value.categoryName) ||
    !isNullableString(value.avgSalaryBand) ||
    !isNullableString(value.outlook) ||
    !isNullableString(value.description)
  ) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      `items[${index}]의 필수 필드 또는 타입이 OpenAPI 스키마와 다릅니다.`,
    )
  }

  return {
    id: value.id as number,
    code: value.code,
    name: value.name,
    categoryId: value.categoryId as number,
    categoryName: value.categoryName,
    avgSalaryBand: value.avgSalaryBand,
    outlook: value.outlook,
    description: value.description,
  }
}

function parseJobListResponse(value: unknown): ApiJobListResponse {
  if (
    !isRecord(value) ||
    !Number.isInteger(value.total) ||
    !Array.isArray(value.items)
  ) {
    throw new JobsApiError(
      'INVALID_RESPONSE',
      '직무 응답이 { total, items } 구조가 아닙니다.',
    )
  }

  return {
    total: value.total as number,
    items: value.items.map(parseApiJob),
  }
}

export async function fetchJobs(signal?: AbortSignal): Promise<ApiJob[]> {
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
    const headers = new Headers({ Accept: 'application/json' })
    try {
      const hostname = new URL(API_BASE_URL).hostname
      if (hostname.endsWith('.ngrok-free.dev')) {
        // 실제 ngrok 응답에서 ERR_NGROK_6024 경고가 확인되어 필요하다.
        headers.set('ngrok-skip-browser-warning', 'true')
      }
    } catch {
      // 잘못된 기본 URL은 아래 fetch 오류로 분류한다.
    }

    const response = await fetch(`${API_BASE_URL}${JOBS_PATH}`, {
      method: 'GET',
      headers,
      signal: requestController.signal,
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

    let payload: unknown
    try {
      payload = JSON.parse(responseText) as unknown
    } catch {
      throw new JobsApiError(
        'JSON_PARSE',
        '직무 API 응답을 JSON으로 해석할 수 없습니다.',
      )
    }

    const { items } = parseJobListResponse(payload)
    if (items.length === 0) {
      throw new JobsApiError('EMPTY_JOBS', '직무 목록이 비어 있습니다.')
    }

    if (import.meta.env.DEV) {
      console.log('백엔드에서 불러온 직무 데이터:', items)
    }

    return items
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
