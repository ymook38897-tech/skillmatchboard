import type { VoiceQuestionId, VoiceInterviewAnswers } from '../types/flow'

interface AnswerReviewPageProps {
  answers: VoiceInterviewAnswers
  selectedCertificationLabel?: string
  didSkipCertification?: boolean
  onEdit: (questionId: VoiceQuestionId) => void
  onNext: () => void
  onPrev: () => void
  isSubmitting?: boolean
}

export function AnswerReviewPage({
  answers,
  selectedCertificationLabel = '',
  didSkipCertification = false,
  onEdit,
  onNext,
  isSubmitting = false,
}: AnswerReviewPageProps) {
  const reviewItems: { id: VoiceQuestionId; label: string }[] = [
    { id: 'difficulty', label: '피하고 싶은 일' },
    { id: 'experience', label: '기억나는 일' },
    { id: 'interest', label: '해보고 싶은 일' },
    { id: 'strength', label: '평소에 자주 하는 일' },
    { id: 'certificate', label: '보유 자격증' },
  ]

  const getDisplayValue = (id: VoiceQuestionId) => {
    if (id !== 'certificate') return answers[id]
    if (selectedCertificationLabel) return selectedCertificationLabel
    if (didSkipCertification) return '안 고르기'
    return answers.certificate
  }

  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main className="relative mx-auto min-h-[100svh] w-full max-w-[800px] overflow-hidden bg-white px-[clamp(24px,6vw,48px)] pb-[clamp(152px,15svh,192px)] pt-[clamp(92px,13.3svh,170px)] sm:rounded-[24px]">
        <header>
          <h1 className="text-[clamp(34px,6vw,48px)] font-extrabold leading-[1.25] tracking-[-0.035em] text-[#111827]">
            답변을 확인해 주세요
          </h1>
        </header>

        <section className="mt-[clamp(52px,6.25svh,80px)] space-y-3">
          {reviewItems.map((item) => (
            <article
              key={item.id}
              className="flex min-h-[112px] items-center gap-5 rounded-[8px] bg-[#F5F7FA] px-[clamp(20px,3.75vw,30px)] py-4"
            >
              <div className="min-w-0 flex-1">
                <h2 className="text-[clamp(16px,2.75vw,22px)] font-medium text-[#596579]">
                  {item.label}
                </h2>
                <p className="mt-2 line-clamp-2 text-[clamp(20px,3.75vw,30px)] font-medium leading-[1.35] tracking-[-0.025em] text-[#111827]">
                  {getDisplayValue(item.id)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEdit(item.id)}
                className="min-h-16 shrink-0 rounded-[8px] border-2 border-[#397AF4] bg-white px-[clamp(16px,3vw,24px)] text-[clamp(17px,2.75vw,22px)] font-bold text-[#2468F2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE]"
              >
                수정
              </button>
            </article>
          ))}
        </section>

        <footer className="absolute inset-x-0 bottom-0 bg-white px-[clamp(24px,6vw,48px)] pb-[clamp(28px,4svh,52px)] pt-5">
          <button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="h-[clamp(68px,7.5svh,96px)] w-full rounded-[8px] bg-[#2468F2] text-[clamp(22px,3.5vw,28px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF] disabled:cursor-wait"
          >
            직무 찾기
          </button>
        </footer>
      </main>
    </div>
  )
}
