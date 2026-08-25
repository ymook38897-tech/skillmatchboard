import type { SessionApiResponse } from '../types/api'
import { ApiRequestError, isRecord, postJson } from './apiBase'

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function parseSessionResponse(payload: unknown): SessionApiResponse {
  if (!isRecord(payload)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '세션 생성 응답이 객체가 아닙니다.',
    )
  }

  const {
    session_id,
    created_at,
    expires_at,
    idle_timeout_seconds,
    max_ttl_seconds,
  } = payload

  if (
    typeof session_id !== 'string' ||
    !session_id.trim() ||
    typeof created_at !== 'string' ||
    typeof expires_at !== 'string' ||
    !isFiniteNumber(idle_timeout_seconds) ||
    !isFiniteNumber(max_ttl_seconds)
  ) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '세션 생성 응답 형식이 올바르지 않습니다.',
      { details: payload },
    )
  }

  return {
    session_id,
    created_at,
    expires_at,
    idle_timeout_seconds,
    max_ttl_seconds,
  }
}

export async function createVoiceSession(
  signal?: AbortSignal,
): Promise<SessionApiResponse> {
  const payload = await postJson('/api/sessions', {}, signal)
  return parseSessionResponse(payload)
}
