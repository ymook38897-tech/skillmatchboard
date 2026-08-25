import type {
  VoiceAnswerApiRequest,
  VoiceAnswerApiResponse,
  VoiceAudioApiPayload,
  VoiceQuestionKey,
} from '../types/api'
import type { VoiceQuestionId } from '../types/flow'
import { ApiRequestError, isRecord, postJson } from './apiBase'

export const QUESTION_KEY_MAP: Record<VoiceQuestionId, VoiceQuestionKey> = {
  difficulty: 'C',
  experience: 'D',
  interest: 'E',
  strength: 'F',
  certificate: 'G',
}

export const QUESTION_ID_MAP: Record<VoiceQuestionKey, VoiceQuestionId> = {
  C: 'difficulty',
  D: 'experience',
  E: 'interest',
  F: 'strength',
  G: 'certificate',
}

function isVoiceQuestionKey(value: unknown): value is VoiceQuestionKey {
  return value === 'C' || value === 'D' || value === 'E' || value === 'F' || value === 'G'
}

export function parseVoiceAnswerResponse(
  payload: unknown,
): VoiceAnswerApiResponse {
  if (!isRecord(payload)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '음성 답변 응답이 객체가 아닙니다.',
    )
  }

  const {
    sessionId,
    questionKey,
    status,
    sttText,
    keywords,
    confidence,
    answeredAt,
  } = payload

  if (
    typeof sessionId !== 'string' ||
    !sessionId.trim() ||
    !isVoiceQuestionKey(questionKey) ||
    (status !== 'ok' && status !== 'low_confidence')
  ) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '음성 답변 응답의 필수 필드가 올바르지 않습니다.',
      { details: payload },
    )
  }

  if (status === 'ok' && (typeof sttText !== 'string' || !sttText.trim())) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '정상 음성 답변에 인식 문장이 없습니다.',
      { details: payload },
    )
  }

  if (keywords !== undefined && !Array.isArray(keywords)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '음성 답변 keywords 형식이 올바르지 않습니다.',
      { details: payload },
    )
  }

  return {
    sessionId,
    questionKey,
    status,
    sttText: typeof sttText === 'string' ? sttText : undefined,
    keywords: Array.isArray(keywords)
      ? keywords.filter((keyword): keyword is string => typeof keyword === 'string')
      : [],
    confidence: typeof confidence === 'number' ? confidence : undefined,
    answeredAt: typeof answeredAt === 'string' ? answeredAt : undefined,
  }
}

export function createVoiceAnswerRequest(
  questionId: VoiceQuestionId,
  audio: VoiceAudioApiPayload,
): VoiceAnswerApiRequest {
  return {
    questionKey: QUESTION_KEY_MAP[questionId],
    audio,
  }
}

export async function submitVoiceAnswer(
  sessionId: string,
  questionId: VoiceQuestionId,
  audio: VoiceAudioApiPayload,
  signal?: AbortSignal,
): Promise<VoiceAnswerApiResponse> {
  const request = createVoiceAnswerRequest(questionId, audio)
  const payload = await postJson(
    `/api/sessions/${encodeURIComponent(sessionId)}/voice-answers`,
    request,
    signal,
    90_000,
  )
  const response = parseVoiceAnswerResponse(payload)

  if (response.sessionId !== sessionId) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '음성 답변의 sessionId가 요청과 다릅니다.',
      { details: payload },
    )
  }

  if (response.questionKey !== request.questionKey) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '음성 답변의 questionKey가 요청과 다릅니다.',
      { details: payload },
    )
  }

  return response
}
