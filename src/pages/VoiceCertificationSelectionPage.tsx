import { useState } from 'react'
import type { CertificationCandidate } from '../types/flow'

interface CertificationSelectionPageProps {
  candidates: CertificationCandidate[]
  initialSelectedId: string | null
  onPrev: () => void
  onSkip: () => void
  onComplete: (candidate: CertificationCandidate) => void
}

export function VoiceCertificationSelectionPage({
  candidates,
  initialSelectedId,
  onPrev,
  onSkip,
  onComplete,
}: CertificationSelectionPageProps) {
  const safeInitialId = candidates.some(
    (candidate) => candidate.id === initialSelectedId,
  )
    ? initialSelectedId
    : null
  const [selectedId, setSelectedId] = useState<string | null>(safeInitialId)
  const selectedCandidate =
    candidates.find((candidate) => candidate.id === selectedId) ?? null

  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main className="relative mx-auto flex min-h-[100svh] w-full max-w-[800px] flex-col overflow-hidden bg-white sm:rounded-[24px]">
        <header className="px-[clamp(24px,6.25vw,50px)] pt-[clamp(34px,4.4svh,56px)]">
          <div className="flex items-center gap-[clamp(6px,1.2vw,10px)]">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="h-[5px] flex-1 rounded-full bg-[#2468F2]"
              />
            ))}
            <span className="ml-2 shrink-0 text-[clamp(14px,2vw,16px)] font-bold text-[#6B7280]">
              5/5
            </span>
          </div>
        </header>

        <section className="flex flex-1 flex-col px-[clamp(24px,6vw,48px)] pb-[clamp(156px,16svh,205px)] pt-[clamp(72px,8.2svh,105px)]">
          <header className="text-center">
            <h1 className="text-[clamp(28px,5vw,40px)] font-extrabold leading-[1.3] tracking-[-0.035em] text-[#111827]">
              보유한 자격증을 선택해 주세요
            </h1>
            <p className="mt-[clamp(44px,5.5svh,70px)] text-[clamp(16px,2.75vw,22px)] font-medium text-[#7A8494]">
              많이 보유한 순으로 보여드려요
            </p>
          </header>

          <div className="mt-[clamp(24px,2.7svh,34px)] min-h-0 flex-1 space-y-3 overflow-y-auto">
            {candidates.map((candidate, index) => {
              const isSelected = candidate.id === selectedId
              return (
                <button
                  key={candidate.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(candidate.id)}
                  className={`flex min-h-[clamp(78px,7.8svh,100px)] w-full items-center gap-5 rounded-[8px] border-2 px-[clamp(18px,3.5vw,28px)] text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE] ${
                    isSelected
                      ? 'border-[#2468F2] bg-[#F3F7FF]'
                      : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  <span className="flex size-[clamp(38px,5.5vw,44px)] shrink-0 items-center justify-center rounded-full bg-[#F3F7FF] text-[clamp(18px,2.75vw,22px)] font-extrabold text-[#2468F2]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-[clamp(18px,3.25vw,26px)] font-medium text-[#111827]">
                    {candidate.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex size-[clamp(28px,4.5vw,36px)] shrink-0 items-center justify-center rounded-full border-2 text-[clamp(14px,2vw,16px)] font-black ${
                      isSelected
                        ? 'border-[#2468F2] bg-[#2468F2] text-white'
                        : 'border-[#D8DEE8] bg-white text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="mx-auto mt-[clamp(28px,3.5svh,44px)] min-h-14 px-6 text-[clamp(17px,2.75vw,22px)] font-medium text-[#697386] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE]"
          >
            안 고르기
          </button>
        </section>

        <footer className="absolute inset-x-0 bottom-0 flex gap-4 bg-white px-[clamp(24px,6vw,48px)] pb-[clamp(28px,4svh,52px)] pt-5">
          <button
            type="button"
            onClick={onPrev}
            className="h-[clamp(68px,7.5svh,96px)] flex-1 rounded-[8px] border-2 border-[#8EB4FF] bg-white text-[clamp(20px,3.25vw,26px)] font-extrabold text-[#2468F2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE]"
          >
            이전
          </button>
          <button
            type="button"
            disabled={!selectedCandidate}
            onClick={() => {
              if (selectedCandidate) onComplete(selectedCandidate)
            }}
            className="h-[clamp(68px,7.5svh,96px)] flex-1 rounded-[8px] bg-[#2468F2] text-[clamp(20px,3.25vw,26px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF] disabled:bg-[#C8D6F3] disabled:text-white"
          >
            선택 완료
          </button>
        </footer>
      </main>
    </div>
  )
}
