import type {
  QuestionProcessingError,
  QuestionProcessingErrorCode,
  UserFormData,
  QuestionId,
} from '../types'
import { QUESTIONS } from '../data/questions'

const REQUEST_TIMEOUT_MS = 30_000

export type ProcessAnswerErrorCode = QuestionProcessingErrorCode | 'ABORTED'

export class ProcessAnswerError extends Error {
  readonly code: ProcessAnswerErrorCode
  readonly userMessage: string
  readonly developerMessage: string

  constructor(code: ProcessAnswerErrorCode, userMessage: string, developerMessage: string) {
    super(developerMessage)
    this.name = 'ProcessAnswerError'
    this.code = code
    this.userMessage = userMessage
    this.developerMessage = developerMessage
  }
}

function getUserMessageByCode(code: ProcessAnswerErrorCode): string {
  const messages: Record<ProcessAnswerErrorCode, string> = {
    NETWORK_OR_CORS:
      '인터넷 연결이 원활하지 않아요. 연결 상태를 확인한 뒤 다시 시도해주세요.',
    TIMEOUT: '응답이 예상보다 늦어지고 있어요. 잠시 후 다시 시도해주세요.',
    SERVER_ERROR: '서비스 연결이 원활하지 않아요. 잠시 후 다시 시도해주세요.',
    INVALID_RESPONSE: '다음 질문을 준비하는 중 문제가 발생했어요. 다시 시도해주세요.',
    UNKNOWN: '알 수 없는 오류가 발생했어요. 다시 시도해주세요.',
    ABORTED: '요청이 취소되었습니다.',
  }
  return messages[code] || messages.UNKNOWN
}

async function mockProcessAnswer(
  _currentQuestionIndex: number,
  _formData: UserFormData,
  signal: AbortSignal,
): Promise<void> {
  if (signal.aborted) {
    throw new ProcessAnswerError(
      'ABORTED',
      '요청이 취소되었습니다.',
      '요청이 취소되었습니다.',
    )
  }

  const useMock = import.meta.env.VITE_USE_MOCK_LLM === 'true'
  if (!useMock) {
    return
  }

  const mockMode = import.meta.env.VITE_MOCK_LLM_MODE ?? 'success'
  const mockDelayMs = parseInt(import.meta.env.VITE_MOCK_LLM_DELAY_MS ?? '1000', 10)

  const performMock = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        if (signal.aborted) {
          reject(
            new ProcessAnswerError(
              'ABORTED',
              '요청이 취소되었습니다.',
              '요청이 취소되었습니다.',
            ),
          )
          return
        }

        switch (mockMode) {
          case 'success':
            resolve()
            break
          case 'error':
            reject(
              new ProcessAnswerError(
                'SERVER_ERROR',
                getUserMessageByCode('SERVER_ERROR'),
                'Mock error mode: Server error',
              ),
            )
            break
          case 'timeout':
            reject(
              new ProcessAnswerError(
                'TIMEOUT',
                getUserMessageByCode('TIMEOUT'),
                'Mock error mode: Timeout',
              ),
            )
            break
          default:
            resolve()
        }
      }, mockDelayMs)

      signal.addEventListener(
        'abort',
        () => {
          window.clearTimeout(timeoutId)
          reject(
            new ProcessAnswerError(
              'ABORTED',
              '요청이 취소되었습니다.',
              '요청이 취소되었습니다.',
            ),
          )
        },
        { once: true },
      )
    })
  }

  await performMock()
}

export async function processQuestionAnswer(
  currentQuestionIndex: QuestionId,
  formData: UserFormData,
  signal?: AbortSignal,
): Promise<void> {
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
  }, REQUEST_TIMEOUT_MS)

  try {
    if (import.meta.env.VITE_USE_MOCK_LLM === 'true') {
      await mockProcessAnswer(currentQuestionIndex, formData, controller.signal)
      return
    }

    // 실제 LLM 백엔드 API를 여기에 추가
    // 현재는 구현되지 않았으므로 아무것도 하지 않음
    const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1
    if (!isLastQuestion) {
      // 질문 사이 처리는 나중에 구현
    }
  } catch (error: unknown) {
    if (error instanceof ProcessAnswerError) {
      throw error
    }

    if (abortReason === 'caller') {
      throw new ProcessAnswerError(
        'ABORTED',
        '요청이 취소되었습니다.',
        '요청이 취소되었습니다.',
      )
    }

    if (abortReason === 'timeout') {
      throw new ProcessAnswerError(
        'TIMEOUT',
        getUserMessageByCode('TIMEOUT'),
        `요청이 ${REQUEST_TIMEOUT_MS}ms 안에 응답하지 않았습니다.`,
      )
    }

    if (error instanceof Error) {
      throw new ProcessAnswerError(
        'NETWORK_OR_CORS',
        getUserMessageByCode('NETWORK_OR_CORS'),
        `Network or CORS error: ${error.message}`,
      )
    }

    throw new ProcessAnswerError(
      'UNKNOWN',
      getUserMessageByCode('UNKNOWN'),
      '알 수 없는 오류가 발생했습니다.',
    )
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortFromCaller)
  }
}
