export const FLOW_PAGE_IDS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'] as const

export type FlowPageId = (typeof FLOW_PAGE_IDS)[number]

export type AgeBandId =
  | '18-29'
  | '30-49'
  | '50-64'
  | 'under-50'
  | '50-54'
  | '55-59'
  | '60-64'
  | '65-plus'
  | 'prefer-not-to-answer'

export type ExperienceCategoryId =
  | 'driving-transport'
  | 'cooking-food'
  | 'facility-safety'
  | 'office-accounting'
  | 'care-welfare'
  | 'technical-skills'
  | 'beauty-service'
  | 'other'

export interface ProfileDraft {
  ageBand: AgeBandId | null
  experienceCategoryIds: ExperienceCategoryId[]
  experienceNone: boolean
  barrierIds: string[]
  barrierNone: boolean
  certificationIds: string[]
  certificationNone: boolean
  certificationOther: string
}

export type TraitQuestionTopic = 'experience' | 'condition' | 'preference'

export interface TraitQuestion {
  id: string
  statement: string
  topic: TraitQuestionTopic
  signalTag: string
}

export const TRAIT_RESPONSE_OPTIONS = [
  { code: 'strongly_agree', label: '매우 동의' },
  { code: 'agree', label: '동의' },
  { code: 'unsure', label: '잘 모르겠음' },
  { code: 'disagree', label: '비동의' },
  { code: 'strongly_disagree', label: '매우 비동의' },
] as const

export type TraitResponseCode =
  (typeof TRAIT_RESPONSE_OPTIONS)[number]['code']

export type TraitResponseMap = Record<string, TraitResponseCode>

export interface Recommendation {
  jobCode: string
  formalName: string
  displayName: string
  oneLiner: string
  reason: string
  tasks: string[]
}

export type TransitionTarget = 'questions' | 'recommendations'

export type FlowTransitionState =
  | { kind: 'idle' }
  | { kind: 'loading'; target: TransitionTarget }
  | { kind: 'error'; target: TransitionTarget }
  | { kind: 'empty' }

// Voice Interview Flow Types
export type VoiceQuestionId =
  | 'difficulty'
  | 'experience'
  | 'interest'
  | 'strength'
  | 'certificate'

export type VoiceQuestionStatus = 'idle' | 'recording' | 'success' | 'error'

export interface VoiceQuestion {
  id: VoiceQuestionId
  title: string
  order: number
}

export interface VoiceInterviewAnswers {
  difficulty: string
  experience: string
  interest: string
  strength: string
  certificate: string
}

export interface VoiceAnswerData {
  sttText: string
  keywords: string[]
  confidence?: number
  answeredAt?: string
}

export type VoiceInterviewAnswerDetails = Partial<
  Record<VoiceQuestionId, VoiceAnswerData>
>

export interface VoiceJob {
  id: string
  name: string
  jobCode: string
  formalName: string
  oneLiner: string
  reason: string
  matchedKeywords: string[]
}

export type VoiceFlowStep =
  | 'start'
  | 'tutorial'
  | 'voice-question'
  | 'answer-review'
  | 'job-recommendation'
  | 'resume'
