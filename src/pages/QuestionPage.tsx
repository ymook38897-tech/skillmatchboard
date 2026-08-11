import { useEffect, useRef } from 'react'
import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'
import {
  TRAIT_RESPONSE_OPTIONS,
  type TraitQuestion,
  type TraitResponseCode,
  type TraitResponseMap,
} from '../types/flow'

interface QuestionPageProps {
  questions: TraitQuestion[]
  responses: TraitResponseMap
  revealedCount: number
  showRecommendationAction: boolean
  onAnswer: (questionId: string, response: TraitResponseCode) => void
  onContinue: () => void
  onPrev: () => void
  onHelp: () => void
}

export function QuestionPage({
  questions,
  responses,
  revealedCount,
  showRecommendationAction,
  onAnswer,
  onContinue,
  onPrev,
  onHelp,
}: QuestionPageProps) {
  const latestQuestionRef = useRef<HTMLElement>(null)
  const previousRevealedCountRef = useRef(revealedCount)
  const visibleQuestions = questions.slice(0, revealedCount)
  const answeredCount = questions.filter((question) => responses[question.id])
    .length
  const allAnswered = questions.length > 0 && answeredCount === questions.length

  useEffect(() => {
    if (revealedCount > previousRevealedCountRef.current) {
      latestQuestionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
    previousRevealedCountRef.current = revealedCount
  }, [revealedCount])

  return (
    <div className="min-h-screen bg-[#FAF8F2] pb-40 text-[#0D0C0C]">
      <TopBar
        pageId="P4"
        onHelp={onHelp}
        progressLabel={`${answeredCount} / ${questions.length}`}
        progressValue={
          questions.length > 0 ? (answeredCount / questions.length) * 100 : 0
        }
      />
      <main className="mx-auto w-full max-w-5xl px-6 pt-32">
        <h1 className="mb-5 text-[2.75rem] font-extrabold leading-tight">
          맞춤 성향 질문
        </h1>
        <p className="mb-10 text-2xl leading-normal text-[#4D4B46]">
          각 문장을 읽고 지금의 나와 가까운 답을 골라 주세요.
        </p>

        <div className="space-y-8">
          {visibleQuestions.map((question, index) => {
            const selectedResponse = responses[question.id]
            const isLatest = index === visibleQuestions.length - 1

            return (
              <section
                key={question.id}
                ref={isLatest ? latestQuestionRef : undefined}
                aria-labelledby={`${question.id}-title`}
                className="scroll-mt-32 rounded-2xl border-2 border-primary-200 bg-white p-7"
              >
                <p className="mb-4 text-xl font-bold text-primary-700">
                  질문 {index + 1}
                </p>
                <h2
                  id={`${question.id}-title`}
                  className="mb-7 text-[2.375rem] font-extrabold leading-[1.3]"
                >
                  {question.statement}
                </h2>
                <div className="grid gap-3 lg:grid-cols-5">
                  {TRAIT_RESPONSE_OPTIONS.map((option) => {
                    const selected = selectedResponse === option.code
                    return (
                      <button
                        key={option.code}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onAnswer(question.id, option.code)}
                        className={`min-h-[5.5rem] rounded-xl border-4 px-4 py-4 text-2xl font-bold leading-snug focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 ${
                          selected
                            ? 'border-primary-600 bg-primary-100'
                            : 'border-[#4D4B46] bg-[#FAF8F2]'
                        }`}
                      >
                        {selected ? '선택됨 · ' : ''}
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t-2 border-primary-100 bg-[#FAF8F2] px-6 py-4">
        <div className="mx-auto flex max-w-5xl gap-4">
          <Button
            variant="outline"
            size="xl"
            onClick={onPrev}
            className={
              allAnswered && showRecommendationAction
                ? 'w-1/2'
                : 'w-full sm:w-1/2'
            }
          >
            이전
          </Button>
          {allAnswered && showRecommendationAction && (
            <Button
              variant="primary"
              size="xl"
              onClick={onContinue}
              className="w-1/2"
            >
              추천 직무 보기
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
