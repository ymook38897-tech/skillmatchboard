export type JobApiSchema = 'legacy' | 'new'

export interface LegacyApiJob {
  id: number
  code: string
  name: string
  categoryId: number
  categoryName: string
  avgSalaryBand: string | null
  outlook: string | null
  description: string | null
}

export interface NewApiJob {
  id: number
  name: string
  easyName: string | null
  description: string | null
  categoryId: number
  categoryName: string
  subCategoryName: string | null
  detailCategoryName: string | null
  requiresCert: boolean
  certNote: string | null
  isRecommendable: boolean
}

export type CompatibleApiJob = LegacyApiJob | NewApiJob

export interface ApiJobListResponse<
  TJob extends CompatibleApiJob = CompatibleApiJob,
> {
  total: number
  items: TJob[]
}

export interface NormalizedJob {
  id: number
  displayName: string
  description: string
  categoryId: number
  categoryName: string
  certificationNote: string | null
  sourceSchema: JobApiSchema
}

export interface SessionApiResponse {
  sessionId: string
  createdAt: string
  expiresAt: string
  idleTimeoutSeconds: number
  maxTtlSeconds: number
}

export type VoiceQuestionKey = 'C' | 'D' | 'E' | 'F' | 'G'

export interface VoiceAudioApiPayload {
  format: 'webm'
  codec: 'opus'
  encoding: 'base64'
  sampleRate?: number
  durationMs: number
  data: string
}

export interface VoiceAnswerApiRequest {
  questionKey: VoiceQuestionKey
  audio: VoiceAudioApiPayload
}

export interface MatchedCertification {
  code: string
  name: string
  grade?: string | null
  kind?: string | null
}

export interface VoiceAnswerApiResponse {
  sessionId: string
  questionKey: VoiceQuestionKey
  status: 'ok' | 'no_speech'
  sttText?: string
  keywords?: string[]
  confidence?: number
  answeredAt?: string
  matchedCertifications?: MatchedCertification[]
}

export interface VoiceRecommendationApiJob {
  id: number
  name: string
  easyName: string | null
  description: string | null
  categoryId: number
  categoryName: string
  subCategoryName: string | null
  detailCategoryName: string | null
  requiresCert: boolean
  certNote: string | null
  isRecommendable: boolean
  reason: string
  matchedKeywords: string[]
}

export interface VoiceRecommendationApiResponse {
  sessionId: string
  basedOnQuestions: VoiceQuestionKey[]
  generatedAt: string
  total: number
  isFallback: boolean
  jobs: VoiceRecommendationApiJob[]
}
