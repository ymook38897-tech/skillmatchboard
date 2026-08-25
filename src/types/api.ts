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
  session_id: string
  created_at: string
  expires_at: string
  idle_timeout_seconds: number
  max_ttl_seconds: number
}

export type VoiceQuestionKey = 'C' | 'D' | 'E' | 'F' | 'G'

export interface VoiceAudioApiPayload {
  format: 'webm'
  codec: 'opus'
  encoding: 'base64'
  sample_rate?: number
  duration_ms: number
  data: string
}

export interface VoiceAnswerApiRequest {
  question_key: VoiceQuestionKey
  audio: VoiceAudioApiPayload
}

export interface VoiceAnswerApiResponse {
  session_id: string
  question_key: VoiceQuestionKey
  status: 'ok' | 'low_confidence'
  stt_text?: string
  keywords?: string[]
  confidence?: number
  answered_at?: string
}

export interface VoiceRecommendationApiJob {
  job_code: string
  job_name: string
  job_name_easy: string
  one_liner: string
  reason: string
  matched_keywords: string[]
}

export interface VoiceRecommendationApiResponse {
  session_id: string
  based_on_questions: VoiceQuestionKey[]
  generated_at: string
  jobs: VoiceRecommendationApiJob[]
}
