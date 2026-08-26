import type { MatchedCertification } from '../types/api'
import { ApiRequestError, isRecord, getJson } from './apiBase'

export interface CertificationQueryParams {
  query?: string
  fieldGroup?: string
  grade?: string
  limit?: number
  offset?: number
}

export interface Certification extends MatchedCertification {
  certCode: string
  certName: string
  fieldOfficial?: string | null
  commonRank?: string | null
  jobCodes?: number[] | null
  verified?: boolean
}

export interface CertificationListResponse {
  total: number
  items: Certification[]
}

function isCertification(value: unknown): value is Certification {
  if (!isRecord(value)) return false
  return (
    typeof value.certCode === 'string' &&
    typeof value.certName === 'string' &&
    (value.code === undefined || typeof value.code === 'string') &&
    (value.name === undefined || typeof value.name === 'string')
  )
}

export function parseCertificationListResponse(
  payload: unknown,
): CertificationListResponse {
  if (!isRecord(payload)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '자격증 목록 응답이 객체가 아닙니다.',
    )
  }

  const { total, items } = payload

  if (typeof total !== 'number' || total < 0) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '자격증 목록 응답의 total 필드가 올바르지 않습니다.',
      { details: payload },
    )
  }

  if (!Array.isArray(items)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '자격증 목록 응답의 items 필드가 배열이 아닙니다.',
      { details: payload },
    )
  }

  return {
    total,
    items: items.filter(isCertification),
  }
}

export async function fetchCertifications(
  params?: CertificationQueryParams,
  signal?: AbortSignal,
): Promise<CertificationListResponse> {
  const searchParams = new URLSearchParams()

  if (params?.query) searchParams.append('query', params.query)
  if (params?.fieldGroup) searchParams.append('fieldGroup', params.fieldGroup)
  if (params?.grade) searchParams.append('grade', params.grade)
  if (params?.limit !== undefined) searchParams.append('limit', String(params.limit))
  if (params?.offset !== undefined) searchParams.append('offset', String(params.offset))

  const query = searchParams.toString()
  const url = query ? `/api/certifications?${query}` : '/api/certifications'

  const payload = await getJson(url, signal, 30_000)
  return parseCertificationListResponse(payload)
}

export async function fetchCertificationByCode(
  certCode: string,
  signal?: AbortSignal,
): Promise<Certification> {
  const payload = await getJson(
    `/api/certifications/${encodeURIComponent(certCode)}`,
    signal,
    30_000,
  )

  if (!isCertification(payload)) {
    throw new ApiRequestError(
      'INVALID_RESPONSE',
      '자격증 상세 응답 형식이 올바르지 않습니다.',
      { details: payload },
    )
  }

  return payload
}
