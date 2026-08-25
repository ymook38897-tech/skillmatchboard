import type { SessionApiResponse } from '../types/api'
import { ApiRequestError, isRecord, postJson } from './apiBase'

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function parseSessionResponse(payload: unknown): SessionApiResponse {
  if (!isRecord(payload)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '세션 생성 응답이 객체가 아닙니다.',
    )
  }

  const {
    sessionId,
    createdAt,
    expiresAt,
    idleTimeoutSeconds,
    maxTtlSeconds,
  } = payload

  if (
    typeof sessionId !== 'string' ||
    !sessionId.trim() ||
    typeof createdAt !== 'string' ||
    typeof expiresAt !== 'string' ||
    !isFiniteNumber(idleTimeoutSeconds) ||
    !isFiniteNumber(maxTtlSeconds)
  ) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '세션 생성 응답 형식이 올바르지 않습니다.',
      { details: payload },
    )
  }

  return {
    sessionId,
    createdAt,
    expiresAt,
    idleTimeoutSeconds,
    maxTtlSeconds,
  }
}

export async function createVoiceSession(
  signal?: AbortSignal,
): Promise<SessionApiResponse> {
  const payload = await postJson('/api/sessions', {}, signal)
  return parseSessionResponse(payload)
}
