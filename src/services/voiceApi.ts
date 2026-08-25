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

function parseVoiceAnswerResponse(
  payload: unknown,
  expectedSessionId: string,
  expectedQuestionKey: VoiceQuestionKey,
): VoiceAnswerApiResponse {
  if (!isRecord(payload)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '음성 답변 응답이 객체가 아닙니다.',
    )
  }

  const {
    session_id,
    question_key,
    status,
    stt_text,
    keywords,
    confidence,
    answered_at,
  } = payload

  if (status !== 'ok' && status !== 'low_confidence') {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '음성 답변 응답의 필수 필드가 올바르지 않습니다.',
      { details: payload },
    )
  }

  if (status === 'ok' && (typeof stt_text !== 'string' || !stt_text.trim())) {
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
    session_id:
      typeof session_id === 'string' ? session_id : expectedSessionId,
    question_key: isVoiceQuestionKey(question_key)
      ? question_key
      : expectedQuestionKey,
    status,
    stt_text: typeof stt_text === 'string' ? stt_text : undefined,
    keywords: Array.isArray(keywords)
      ? keywords.filter((keyword): keyword is string => typeof keyword === 'string')
      : [],
    confidence: typeof confidence === 'number' ? confidence : undefined,
    answered_at: typeof answered_at === 'string' ? answered_at : undefined,
  }
}

export async function submitVoiceAnswer(
  sessionId: string,
  questionId: VoiceQuestionId,
  audio: VoiceAudioApiPayload,
  signal?: AbortSignal,
): Promise<VoiceAnswerApiResponse> {
  const request: VoiceAnswerApiRequest = {
    question_key: QUESTION_KEY_MAP[questionId],
    audio,
  }
  const payload = await postJson(
    `/api/sessions/${encodeURIComponent(sessionId)}/voice-answers`,
    request,
    signal,
    90_000,
  )
  const response = parseVoiceAnswerResponse(
    payload,
    sessionId,
    request.question_key,
  )

  if (response.session_id !== sessionId) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '음성 답변의 session_id가 요청과 다릅니다.',
      { details: payload },
    )
  }

  if (response.question_key !== request.question_key) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '음성 답변의 question_key가 요청과 다릅니다.',
      { details: payload },
    )
  }

  return response
}
