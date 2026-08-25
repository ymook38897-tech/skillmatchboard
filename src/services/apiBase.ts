const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const API_BASE_URL = RAW_API_BASE_URL.trim().replace(/\/+$/, '')

const DEFAULT_REQUEST_TIMEOUT_MS = 30_000

export type ApiRequestErrorKind =
  | 'CONFIGURATION'
  | 'ABORTED'
  | 'TIMEOUT'
  | 'NETWORK_OR_CORS'
  | 'HTTP'
  | 'INVALID_RESPONSE'

export class ApiRequestError extends Error {
  readonly kind: ApiRequestErrorKind
  readonly status?: number
  readonly errorCode?: string
  readonly details?: unknown

  constructor(
    kind: ApiRequestErrorKind,
    message: string,
    options: { status?: number; errorCode?: string; details?: unknown } = {},
  ) {
    super(message)
    this.name = 'ApiRequestError'
    this.kind = kind
    this.status = options.status
    this.errorCode = options.errorCode
    this.details = options.details
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readErrorCode(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined
  if (typeof payload.error_code === 'string') return payload.error_code

  const detail = payload.detail
  if (isRecord(detail) && typeof detail.error_code === 'string') {
    return detail.error_code
  }

  const nestedError = payload.error
  if (isRecord(nestedError) && typeof nestedError.code === 'string') {
    return nestedError.code
  }

  return undefined
}

function createJsonHeaders(): Headers {
  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  })

  try {
    const hostname = new URL(API_BASE_URL).hostname.toLowerCase()
    if (/(^|\.)ngrok(?:-free)?\.(?:app|dev|io)$/.test(hostname)) {
      headers.set('ngrok-skip-browser-warning', 'true')
    }
  } catch {
    // Invalid configuration is reported before the request is sent.
  }

  return headers
}

export async function postJson(
  requestPath: string,
  body: unknown,
  signal?: AbortSignal,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
): Promise<unknown> {
  if (!API_BASE_URL) {
    throw new ApiRequestError(
      'CONFIGURATION',
      'VITE_API_BASE_URL이 설정되지 않았습니다.',
    )
  }

  if (signal?.aborted) {
    throw new ApiRequestError('ABORTED', 'API 요청이 취소되었습니다.')
  }

  const controller = new AbortController()
  let abortReason: 'caller' | 'timeout' | null = null

  const abortRequest = (reason: 'caller' | 'timeout') => {
    if (abortReason !== null) return
    abortReason = reason
    controller.abort()
  }

  const abortFromCaller = () => abortRequest('caller')
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  const timeoutId = window.setTimeout(() => {
    abortRequest('timeout')
  }, timeoutMs)

  try {
    const response = await fetch(`${API_BASE_URL}${requestPath}`, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const responseText = await response.text()
    let payload: unknown = null

    if (responseText) {
      try {
        payload = JSON.parse(responseText) as unknown
      } catch {
        if (response.ok) {
          throw new ApiRequestError(
            'INVALID_RESPONSE',
            'API 응답을 JSON으로 해석할 수 없습니다.',
            { status: response.status },
          )
        }
      }
    }

    if (!response.ok) {
      throw new ApiRequestError(
        'HTTP',
        `API가 HTTP ${response.status}로 응답했습니다.`,
        {
          status: response.status,
          errorCode: readErrorCode(payload),
          details: payload,
        },
      )
    }

    return payload
  } catch (error: unknown) {
    if (error instanceof ApiRequestError) throw error

    if (abortReason === 'caller') {
      throw new ApiRequestError('ABORTED', 'API 요청이 취소되었습니다.')
    }

    if (abortReason === 'timeout') {
      throw new ApiRequestError(
        'TIMEOUT',
        `${timeoutMs}ms 안에 API 응답을 받지 못했습니다.`,
      )
    }

    throw new ApiRequestError(
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
