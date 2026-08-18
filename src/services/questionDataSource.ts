import { MOCK_TRAIT_QUESTIONS } from '../data/mockTraitQuestions'
import type { ProfileDraft, TraitQuestion } from '../types/flow'

export interface QuestionDataSource {
  loadQuestions(
    profile: ProfileDraft,
    signal?: AbortSignal,
  ): Promise<TraitQuestion[]>
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Question request aborted', 'AbortError')
  }
}

export const mockQuestionDataSource: QuestionDataSource = {
  async loadQuestions(_profile, signal) {
    throwIfAborted(signal)
    await Promise.resolve()
    throwIfAborted(signal)

    return MOCK_TRAIT_QUESTIONS.map((question) => ({ ...question }))
  },
}
