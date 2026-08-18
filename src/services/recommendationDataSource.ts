import { MOCK_RESULTS } from '../data/mockResults'
import type {
  ProfileDraft,
  Recommendation,
  TraitQuestion,
  TraitResponseMap,
} from '../types/flow'

export interface RecommendationRequest {
  profile: ProfileDraft
  questions: TraitQuestion[]
  responses: TraitResponseMap
}

export interface RecommendationDataSource {
  loadRecommendations(
    request: RecommendationRequest,
    signal?: AbortSignal,
  ): Promise<Recommendation[]>
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Recommendation request aborted', 'AbortError')
  }
}

export const mockRecommendationDataSource: RecommendationDataSource = {
  async loadRecommendations(request, signal) {
    throwIfAborted(signal)
    await Promise.resolve()
    throwIfAborted(signal)

    const answeredCount = Object.keys(request.responses).length
    const reasonPrefix = request.profile.certificationIds.length
      ? '고르신 자격증과 답변을 함께 살펴봤어요.'
      : `${answeredCount}개의 답변을 바탕으로 살펴봤어요.`

    return MOCK_RESULTS.map((result) => ({
      jobCode: result.id,
      formalName: result.jobTitle,
      displayName: result.jobTitle,
      oneLiner: result.description,
      reason: reasonPrefix,
      tasks: [...result.mainDuties],
    }))
  },
}
